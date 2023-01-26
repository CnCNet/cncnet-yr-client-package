# this script must be called with a github token
# ex: ./download-artifacts.ps1 -GithubToken "abc123"

param($GithubToken)

# load in configuration
$Config = Get-Content "download-artifacts.json" | Out-String | ConvertFrom-Json

# run client downloader
. $PSScriptRoot\updater-scripts\download-artifacts\download-client.ps1 -WorkflowRunId $Config.clientWorkflowRunId -ArtifactName $Config.clientArtifactName -GithubToken $GithubToken -GithubApiVersion $Config.githubApiVersion

# run client launcher downloader
. $PSScriptRoot\updater-scripts\download-artifacts\download-client-launcher.ps1 -GithubToken $GithubToken -GithubApiVersion $Config.githubApiVersion -ReleaseTagName $Config.launcherReleaseTagName -LauncherName $Config.launcherName
