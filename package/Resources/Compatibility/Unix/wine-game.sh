#!/bin/sh
${WINE:=wine} Syringe.exe -i=Ares.dll -i=CnCNet-Spawner.dll -i=Phobos.dll \ "gamemd-spawn.exe" -SPAWN -LOG -CD -Include -Inheritance -RA2ModeSaveID=0x8d113b94
