#!/bin/sh

cd "$(dirname "$0")"
dotnet Resources/BinariesNET8/UniversalGL/clientogl.dll "$@"