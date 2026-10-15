#!/bin/sh
cd "$(dirname "$0")"

# Set an alternative Wine
export WINE=wine

if ! command -v "$WINE" >/dev/null 2>&1; then
    printf 'Error: Wine is required but was not found. Please install Wine and try again.\n' >&2
    exit 1
fi

if ! command -v dotnet >/dev/null 2>&1; then
    printf 'Error: .NET 8 is required but dotnet was not found. Please install the .NET 8 runtime and try again.\n' >&2
    exit 1
fi

if ! dotnet --list-runtimes 2>/dev/null | grep -q '^Microsoft\.NETCore\.App 8\.'; then
    printf 'Error: the .NET 8 runtime is required but was not found. Please install it and try again.\n' >&2
    exit 1
fi

# This isolates Wine configurations for this application
export WINEPREFIX=${PWD}/wineprefix/

# Set win10 windows version for gamemd-spawn.exe
${WINE:=wine} reg add HKEY_CURRENT_USER\\Software\\Wine\\AppDefaults\\gamemd-spawn.exe /v Version /d win10 /f

# Set native,builtin for ddraw override option for gamemd-spawn.exe
${WINE:=wine} reg add HKEY_CURRENT_USER\\Software\\Wine\\AppDefaults\\gamemd-spawn.exe\\DllOverrides /v ddraw /d native,builtin /f

chmod +x Resources/Compatibility/Unix/*.sh

dotnet Resources/BinariesNET8/UniversalGL/clientogl.dll "$@"
