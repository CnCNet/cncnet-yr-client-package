@echo off

::  This program is free software: you can redistribute it and/or modify
::  it under the terms of the GNU General Public License as published by
::  the Free Software Foundation, either version 3 of the License, or
::  (at your option) any later version.
::
::  This program is distributed in the hope that it will be useful,
::  but WITHOUT ANY WARRANTY; without even the implied warranty of
::  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
::  GNU General Public License for more details.
::
::  You should have received a copy of the GNU General Public License
::  along with this program.  If not, see <https://www.gnu.org/licenses/>.

::  This script is a launcher for Yuri's Revenge.
::  It checks if the gamemd.exe exists and its size.
::  If the size is 5 MiB or larger, it launches gamemd.exe.
::  If not, it checks for RA2MD.exe and launches it if found.
::  If not found, it launches gamemd.exe.

setlocal

set "appPath=%~dp0"
set "gameMdPath=%appPath%gamemd.exe"
set "ra2MdPath=%appPath%RA2MD.exe"
set "minSize=5242880" :: 5 MiB in bytes

if not exist "%gameMdPath%" (
    echo Error: gamemd.exe not found.
    exit /b 2
)

for %%A in ("%gameMdPath%") do set "fileSize=%%~zA"

if defined fileSize (
    if "%fileSize%" GEQ "%minSize%" (
        echo Launching gamemd.exe
        start "" "%gameMdPath%"
    ) else (
        if exist "%ra2MdPath%" (
            echo Launching RA2MD.exe
            start "" "%ra2MdPath%"
        ) else (
            echo RA2MD.exe not found. Launching gamemd.exe instead.
            start "" "%gameMdPath%"
        )
    )
) else (
    echo Error: Unable to determine the size of gamemd.exe.
    exit /b 3
)

endlocal
