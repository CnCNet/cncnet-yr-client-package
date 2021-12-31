@echo off

set solutionDir=YRMapsUpdater
set projFile=%solutionDir%\YRMapsUpdater\YRMapUpdater.csproj
set buildFile=%solutionDir%\build\YRMapUpdater.exe

dotnet restore %projFile%

dotnet msbuild %projFile%

%buildFile% -s

pause