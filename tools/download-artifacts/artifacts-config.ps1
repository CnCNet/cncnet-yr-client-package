# read in the configuration
$ArtifactsConfig = Get-Content "$PSScriptRoot\artifacts-config.json" | Out-String | ConvertFrom-Json
