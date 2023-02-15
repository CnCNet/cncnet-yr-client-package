. $PSScriptRoot\..\base-config.ps1

Write-Output $Config

Write-Output "Updating mpmaps.ini..."
$ProjectFile = "$PSScriptRoot\YRMapUpdater\YRMapUpdater.csproj"
$BuildFile = "$PSScriptRoot\build\YRMapUpdater.exe"

#:: restore dependencies for project
dotnet restore $ProjectFile

#:: build project
dotnet msbuild $ProjectFile

# run the project
# -s == silent
# -w <working directory>
# -n <name of the program>
# -m <maps dir relative to working directory>
$Process = Start-Process $BuildFile "-s -w $( $Config.PackagePath ) -n `"Yuri's Revenge Map Updater`" -m `"Maps/Yuri's Revenge`" -l `"$( $Config.LogsPath )/maps-updater`"" -NoNewWindow -Wait
if ($Process.ExitCode > 0)
{
    Throw "Failed to update mpmaps.ini"
}
Write-Output "Done updating mpmaps.ini"
