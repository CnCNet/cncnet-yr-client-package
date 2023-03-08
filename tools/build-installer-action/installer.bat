@echo off
cd ../
cmd /c npm install
cmd /c npm run build-installer-action

echo "build installer complete"
pause
