#!/bin/sh

cd "$(dirname "$0")"
chmod +x ra2md-launcher.sh
dotnet Resources/BinariesNET8/UniversalGL/clientogl.dll "$@"
