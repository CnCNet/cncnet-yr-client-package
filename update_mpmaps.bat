@echo off

set solutionDir=YRMapsUpdater
set projFile=%solutionDir%\YRMapUpdater\YRMapUpdater.csproj
set buildFile=%solutionDir%\build\YRMapUpdater.exe

dotnet restore %projFile%

dotnet msbuild %projFile%

%buildFile% -s

pause