. $PSScriptRoot\..\base-config.ps1

Write-Output "Building installer..."
$InnoBinary = "$PSScriptRoot\bin\ISCC.exe"
$InnoScript = "$PSScriptRoot\installer.iss"

$Process = Start-Process $InnoBinary $InnoScript -NoNewWindow -Wait -WorkingDirectory $PSScriptRoot
if ($Process.ExitCode > 0)
{
    Throw "Failed to build installer"
}

Write-Output "Done building installer"
