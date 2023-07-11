**How to contribute to this repository**
1. Install git from `https://git-scm.com/`
2. Download the  CnCNet YR Package repository code
   - Create a directory anywhere on your local. 
   - Right-click in directory select `git bash`, or navigate to the directory in terminal.
   - Enter `git clone https://github.com/CnCNet/cncnet-yr-client-package.git`
   - You now have the codebase on your local machine.
3. Install your IDE of choice: [Rider](https://www.jetbrains.com/rider/), [Intellij](https://www.jetbrains.com/idea/download/?section=windows), etc


---
**Steps to update the client with new maps**
1. Fetch latest code from repository and update your local code
    - From project terminal execute `git fetch`, `git pull`
    - Create a new branch from develop
    
    
2. Prepare new maps and map images
    - Every map file has an accompanying map image with the same name.
    - Map file names should be as follows: `[num_players]_[mapName].map`, e.g. `2_hail_mary.map`, `2_hail_mary.png`
    - Ensure inside each of map file, under `Basic` the map name starts with number of players, e.g. `Name=[2] Hail Mary`
    - Ensure author is set under `[Basic]` -> `Author=[RU]Polye`
    - Map files should not have enhanced preview image and should be small in file size.
    - Map images should end in .png, should be x768 on longest side, should run through [TinyPNG](https://tinypng.com/) to shrink the image file size

3. Add new map files to the project.  
    - If the map is to be played on the ladder, place the map files and map images in `package\Maps\Yuri's Revenge\`
    - If the map is non-ladder, place it in appropriate folder. Battle, Mod Maps

4. Update `MpMaps.ini`
    - This file is very important, it tells the client what maps to display and in what order.
    - Execute this script to automatically update `MpMaps.ini` for you. `\tools\mpmaps-updater\maps-updater.bat`
    - View the output of the bat file to see any warnings or errors.
    - Open MpMaps.ini and ensure each new map you have inserted is in the file, and double check the GameModes and details.
    
5. Commit and push
    - When all changes are ready, use git to add the files you added, then commit and push them.
    - Using git tools in the IDE is pretty useful for this stuff.
    
6. Create a pull request from your branch to `develop` at https://github.com/CnCNet/cncnet-yr-client-package/pulls
    - Once your code is merged, it is all ready to be updated in the client. There are separate steps to execute the client update with the latest code.