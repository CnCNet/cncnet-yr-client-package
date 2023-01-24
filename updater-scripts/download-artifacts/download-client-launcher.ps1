param($ReleaseTagName, $LauncherName, $GithubToken, $GithubApiVersion)

$RepoRoot = (Get-Item $PSScriptRoot).Parent.Parent
$ResourcesPath = "$RepoRoot\Resources"
$BinariesPath = "$ResourcesPath\Binaries"
$TempPath = "$PSScriptRoot\temp-launcher"
New-Item $TempPath -Force -ItemType "directory"

$ReleaseByTagNameUrl = "https://api.github.com/repos/cncnet/dta-mg-client-launcher/releases/tags/$ReleaseTagName"

# Set headers to be used with api requests
$Headers = @{
    "Authorization" = "Bearer $GithubToken"
    "X-GitHub-Api-Version" = $GithubApiVersion
}

Write-Output "Getting client launcher release by tag name $ReleaseTagName"
$Response = Invoke-RestMethod -Uri $ReleaseByTagNameUrl -Headers $Headers

# Find launcher asset
$LauncherNameRegex = "CnCNet.LauncherStub*"
$ReleaseAssets = $Response.assets | Where-Object { ($_.name -like $LauncherNameRegex) }

# Check to see if any assets were found
if ($ReleaseAssets.Length -eq 0)
{
    Write-Output "No release assets found like name $LauncherNameRegex"
    Exit
}

$ReleaseAsset = $ReleaseAssets[0]
$DownloadedFilename = "$TempPath\$( $ReleaseAsset.name )"
$ExtractionPath = "$TempPath\extracted"

Write-Output "Downloading artifact to $DownloadedFilename"
Invoke-WebRequest -Uri $ReleaseAsset.browser_download_url -Headers $Headers -OutFile $DownloadedFilename

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

# Move launcher to correct location with correct name
$LauncherCopyPath = "$RepoRoot\$LauncherName"
Write-Output "Copying launcher to: $LauncherCopyPath"
Rename-Item "$ExtractionPath\CnCNet.LauncherStub.exe" $LauncherName
Move-Item "$ExtractionPath\$LauncherName" -Destination "$LauncherCopyPath" -Force

# Clean up temp dir
Write-Output "Cleaning up temp files"
Remove-Item $TempPath -Force -Recurse
