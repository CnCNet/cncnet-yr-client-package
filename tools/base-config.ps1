$RepoRoot = (Get-Item $PSScriptRoot).Parent.FullName
$PackagePath = "$RepoRoot\package"
$ResourcesPath = "$PackagePath\Resources"
$BinariesPath = "$ResourcesPath\Binaries"
$LogsPath = "$RepoRoot\logs"

$Config = [PSCustomObject]@{
    RepoRoot = $RepoRoot
    PackagePath = $PackagePath
    ResourcesPath = $ResourcesPath
    BinariesPath = $BinariesPath
    LogsPath = $LogsPath
}
