@echo off

cd ../
cmd /c npm ci
cmd /c npm run mpmaps-updater

pause