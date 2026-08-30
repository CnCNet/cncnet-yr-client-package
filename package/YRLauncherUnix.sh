#!/bin/sh
cd "$(dirname "$0")"

# Set an alternative Wine
export WINE=wine

# This isolates Wine configurations for this application
export WINEPREFIX=${PWD}/wineprefix/

# Set win10 windows version for gamemd-spawn.exe
${WINE:=wine} reg add HKEY_CURRENT_USER\\Software\\Wine\\AppDefaults\\gamemd-spawn.exe /v Version /d win10 /f

# Set native,builtin for ddraw override option for gamemd-spawn.exe
${WINE:=wine} reg add HKEY_CURRENT_USER\\Software\\Wine\\AppDefaults\\gamemd-spawn.exe\\DllOverrides /v ddraw /d native,builtin /f

chmod +x Resources/Compatibility/Unix/*.sh

dotnet Resources/BinariesNET8/UniversalGL/clientogl.dll "$@"
