#
# This script will download the artifact zip for the workflow run ID specified and then
# extract the contents to the necessary locations.
# 
# Ideally, this script would download artifacts and use them immediately when creating a new version or installer
# rather than having to commit these binaries to this repo. However, due to Github artifact retention policies,
# this is not possible, because this script may run when the specified artifacts are no longer available.
# If this should happen, this script will simply terminate.
# 
param($WorkflowRunId, $ArtifactName, $GithubToken, $GithubApiVersion)

$RepoRoot = (Get-Item $PSScriptRoot).Parent.Parent
$ResourcesPath = "$RepoRoot\Resources"
$BinariesPath = "$ResourcesPath\Binaries"
$TempPath = "$PSScriptRoot\temp-client"
New-Item $TempPath -Force -ItemType "directory"

$ArtifactsUrl = "https://api.github.com/repos/cncnet/xna-cncnet-client/actions/runs/$WorkflowRunId/artifacts"

# Set headers to be used with api requests
$Headers = @{
    "Authorization" = "Bearer $GithubToken"
    "X-GitHub-Api-Version" = $GithubApiVersion
}

#
# Get the list of artifacts from repo for workflow run
# Docs: https://docs.github.com/en/rest/actions/artifacts?apiVersion=2022-11-28#list-workflow-run-artifacts
#
Write-Output "Getting artifacts from repo"
$Response = Invoke-RestMethod -Uri $ArtifactsUrl -Headers $Headers

# Filter artifacts to those built for this game
$Artifacts = $Response.artifacts | Where-Object { ($_.name -eq $ArtifactName) }

# Check to see if any artifacts were found
if ($Artifacts.Length -eq 0)
{
    Write-Output "No artifacts found for game"
    Exit
}

$GameArtifact = $Artifacts[0];
Write-Output "Game artifact found:"
Write-Output $GameArtifact | ConvertTo-Json # debug statement

# Download the artifact using the URL that it provides us.
# This will auto overwrite any file that exists with the dynamic name
# Name format: <artifact name>.<artifact ID>.zip
# Name example: artifacts-YR.123456789.zip
$DownloadedName = "$( $GameArtifact.name ).$( $GameArtifact.id )"
$DownloadedFilename = "$TempPath\$DownloadedName.zip"
$ExtractionPath = "$TempPath\$DownloadedName"

Write-Output "Downloading artifact to $DownloadedFilename"
Invoke-WebRequest -Uri $GameArtifact.archive_download_url -Headers $Headers -OutFile $DownloadedFilename

# Checking to see if extraction path already exists
$ExtractionPathExists = Test-Path -Path $ExtractionPath
if ($ExtractionPathExists)
{
    Write-Output "Extraction path already exists. Deleting."
    Remove-Item $ExtractionPath -Force -Recurse
}

# Extract the zip file to a temp extraction directory
Write-Output "Extracting artifact to path: $ExtractionPath"
Expand-Archive -Path $DownloadedFilename -DestinationPath $ExtractionPath

Write-Output "Copying resources to necessary locations"
Copy-Item "$ExtractionPath\Resources\*" -Destination $ResourcesPath -Recurse -Force

# Clean up temp dir
Write-Output "Cleaning up temp files"
Remove-Item $TempPath -Force -Recurse

Write-Output "Done"
