@echo off

cd ../
cmd /c npm ci
cmd /c npm run build-installer

pause
