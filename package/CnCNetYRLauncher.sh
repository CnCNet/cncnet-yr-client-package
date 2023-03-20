#!/bin/sh
cd "$(dirname "$0")"
dotnet Resources/Binaries/UniversalGL/clientogl.dll "$@"
