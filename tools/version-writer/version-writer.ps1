. $PSScriptRoot\..\base-config.ps1

Write-Output "Running VersionWriter..."

$VersionWriterExe = "VersionWriter.exe"
$VersionWriterCopiedFiles = "$( $Config.PackagePath )\VersionWriter-CopiedFiles"
$VersionFile = "$( $Config.PackagePath )\version"
if (Test-Path $VersionFile)
{
    Remove-Item $VersionFile
}
$Process = Start-Process "$PSScriptRoot\$VersionWriterExe" "/S $( $Config.PackagePath )" -Wait -NoNewWindow
if ($Process.ExitCode -gt 0)
{
    Throw "Failed to run VersionWriter.exe"
}
Remove-Item $VersionWriterCopiedFiles -Recurse -Force
if ($Env:CI -eq "true")
{
    Write-Output "Running as CI/CD. Removing versionconfig.ini file."
    $VersionConfigFile = "$( $Config.PackagePath )\versionconfig.ini"
    Remove-Item $VersionConfigFile -Force
}

Write-Output "VersionWriter done."
