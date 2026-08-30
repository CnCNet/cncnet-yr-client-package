
FinalAlert2 v1.02 for YR Patched
(with support for syringe based FA2sp DLL by SECSOME)

Hosted at - https://ppmforums.com/topic-47342/final-alert-2-yr-v102-patches/
FA2sp.dll base repository - https://github.com/secsome/FA2sp
Modified FA2sp.dll old repository - https://github.com/E1Elite/FA2sp
Syringe.exe is v0.7.2.2 with Handshake disabled over v0.7.2.0. Syringe v0.7.2.0 - https://github.com/Ares-Developers/Syringe

#################################################

Contents:
- Changelog
- Details of changes (includes hack details except resource changes)

#################################################

Changelog:

Changes (2024-07-15):
- Adds custom parameter dropdown support for trigger action and events.
- Phobos B43 updates to trigger actions & events and script actions in FAData.ini.

Changes (2024-05-06):
- Updates to Phobos trigger events & actions and script actions in FAData.ini.

Changes (2024-02-22):
- Aqrit's DDraw wrapper placed in FA2 folder to be used by default (From ForWindows10 folder).
- Included MapResize tool updated to latest version.

Changes (2023-12-14):
- Updated FA2sp (based on v1.6.3).
- Few civilian units now show under Others instead of Soviets on sidebar.
- Trigger action 48 Center Camera at Waypoint now shows speed dropdown values.
- Renamed FAData.ini key UsingPhobos to PlayerAtXForTechnos for Phobos (dev build 37 or newer).
- Renamed FAData.ini key DisableFileWatcherPopup to FileWatcher.
- Minor UI updates and description changes in FAData.ini.

Changes (2023-10-07):
- Allow techno properties and propertiy brushes window to show <Player @ (A-H)> for MP maps. This Phobos feature can be disabled with UsingPhobos FAData.ini key.
- DisableFileWatcherPopup FAData.ini key to disable reload map message on external map file modification.

Changes (2023-08-09):
- Local variables dropdown limit of showing only 100 entries removed.
- Display of incorrect Multi-Player (0-7) dropdown entries for RA2 removed.

Changes (2023-06-26):
- Base nodes rendering fix.
- Corrections to script actions 56 and 57 (Chronoshift team).
- Tags and Trigger window updates for persistence attribute.
- FAData.ini, FALanguage.ini and EXE file resource updates.

Changes (2023-06-02):
- Hotkey updates: Multi-select deselect all with Ctrl+D or Ctrl+Shift+D,
D key is kept as is for cliff flat to ground feature.

Changes (2023-05-30):
- Updated FA2sp (based on develop branch commit on 2023-05-25).
(It includes - Show building damage/rubble frames based on health,
external file modification detection etc.)
- FAData.ini, FALanguage.ini and EXE file resource updates.

Changes (2023-05-10):
- Updated FA2sp (based on v1.6.1).
- MultiSelection - Deselect all hotkey changed from Ctrl+D to Ctrl+Shift+D.
- MultiSelection enabled by default in FAData.ini.
- Find coordinate can be accessed with hotkey Ctrl+Shift+F.

Changes (2023-05-03):
- Updated FA2sp (based on v1.6.0).
(This release supports RA2 as well as YR)
- Over 300 translation handles added to FALanguage.ini.
- Updated FAData.ini.

Changes (2023-04-09):
- Fix loading marble.mix file.

Changes (2023-04-07):
- Updated FA2sp (based on develop branch commit on 2023-03-07).
(It includes - Mix loading order made similar to game, Ares 
custom foundation support, overlapping building detection etc.)
- RA2 support is enabled in this release of FA2sp.
- Show/hide money on map Alt+2 hotkey works now.

Changes (2023-02-16):
- Buildings with theater specific file extensions are now displayed.
- Adds Phobos trigger events and actions.
- Included MapResize tool updated to latest version.

Changes (2023-01-13):
- Updated FA2sp (based on v1.5.1.0).

Changes (2023-01-12):
- Updated FA2sp (based on v1.5.0.0).
- Toolbar/buttonbar buttons merged to first bar for left side placement by default.
- Latest Phobos script actions support.
- Default building direction set to 0 from 64.
- UI updated for max map size in new map and resize windows.
- Custom extra parameter support for script actions.
- FAData.ini updated to reflect updated FA2sp.dll.

Changes (2021-10-22):
- FA2sp code changes
-- Base version for changes: FA2sp develop commit as on 20211020.
(Check FA2spReadme.txt for v1.1.2 details).
-- Reverted TicTacToe changes
-- LegacyUI TabControl changes reverted.

Changes (2021-10-19):
- FA2sp code changes
-- Base version for changes: FA2sp develop commit on 20211016.
(Check FA2spReadme.txt for v1.1.2 details).
-- UI Styles enabled to use windows OS look and feel.
-- Accelerators, Menu and dialog resources are added to the DLL.
-- Comes with UI Style disabled DLL, placed in LegacyUI folder.
-- Script action dropdowns has been modified. ScriptParamTypes
section allows user defined parameter dropdowns.
-- Tiles related performance hooks disabled for bugfix.
- FAData.ini changes
-- Autosave feature enabled.
-- ScriptParamTypes section added with entries and description.
- FinalAlert2.dat changes
-- Updated resources for centering few windows and removed 
use of quotes in text to match the dialog resource used in DLL.
- Added KnownIssues.txt file in ReadmeDocs folder.

Changes (2021-09-28):
- FA2sp code changes
-- Base version for changes: FA2sp develop commit on 20210925. 
(Check FA2spReadme.txt for v1.0.6 details). This commit includes
reading palette files from other than cache(md).mix also. 
-- Added show all menu option for displaying map objects.
-- Theater specific ignore sections added.
-- Appended IDs for technotypes on sidebar.
-- Phobos script actions in development (74-102) support added.
-- Few of the script action dropdowns can now have overrides in FAData.ini.
-- Minor change to allies editor to add current country to Allies list.
-- Left out infantry cell spot change.
-- Version info added.
- FAData.ini changes
-- ExtConfig new parameters added with Sidebar and waypoint colors enabled.
-- Theater specific ignore section names added (commented).
-- Trigger action dropdown parameter Float value enabled for actions 71 nd 72.
-- Script parameters of CameraSpeed
-- Phobos support for testing actions 74-102 added with dropdown parameters of 
AITargetType, AITargetCategory and AIScriptsList.
- FinalAlert2.dat changes
-- UI updates on scripts, trigger action, events, taskforce, teams etc.
-- Menu update with hotkeys for show/hide displaying of map objects.
-- Beginner/Easy mode removed.

Changes (2021-05-27):
- FA2sp code changes
-- ForceSide won't limit to rules Sides count.
-- Translation use is now global to show like Tiberium tree as Ore mine.
-- ID appended to terrain on left panel to show like Tree as Tree (TREE01).
-- Color options for selection of current cell under cursor, copy and height dashed line,
- FAData.ini changes
-- Commented color options added
- Readme files from base folder moved to ReadmeDocs folder.

Changes (2021-05-18):
- FA2sp code changes
-- Fix for language section selection.
-- Resources moved to EXE.
- FAData.ini changes
-- Trigger action 42 description updated.
- FA2 EXE changes
-- Resources updated for strings and dialogs.
-- Hotkey added for Tool scripts menu item.
-- Renamed extension from .exe to .dat.

Changes (2021-05-13):
- Included FA2SPLaunch program to launch FA2 with syringe. (Needs .Net 3.5 FW)
- Hack applied to EXE for not changing map extension when saving maps. (Credits: Secsome)

Changes (2021-05-10):
- Fix for taskforce window's unit type dropdown not saving properly.

Changes (2021-05-08):
- FA2sp code changes
-- OverlayFilter option removed, now it caps OverlayTypes index to less than 255.
-- Added most of the dialog resource files to enable further modifications.
-- Change Owner tree browser entry for SP and MP maps changes.
- FAData.ini changes
-- Option flags added - SortByTriggerName, AdjustDropdownWidth etc. and ForceName section.
-- OverlayFilter option removed.
-- Phobos Script Actions 71-73 added.
- Included Aqrit's DDraw wrapper for users of Windows 10 with latest updates.

Changes (2021-03-14):
- FA2sp code changes
-- Change Owner tree entry for SP and MP maps
-- Allow OverlayFilter=no to fill overlays dropdown
-- Fix script action 6, 7 parameter dropdown
- FAData,ini changes
-- Parameter change for event 77

Changes (2021-03-10):
- Support for FA2sp.dll, run with RunFA2sp.bat. FA2Ext.dll is not compatible with this release.
- Reverted status bar coordinates YX to XY hack in the EXE due to incompatibility, it is now part of FA2sp.dll.
- FA2sp code altered and FAData,ini changed to make this release compatible with FA2sp.dll.

Changes (2020-12-14):
- Trigger action and event parameter dropdowns are now wider.
- Script action description box size increased to avoid scrollbar when showing detailed info.
- Includes MapResize tool, an alternative to FA2's resize feature.
- FAData.ini changes
-- Minor parameter type changes
-- Enabled 92, 93 firestorm defense map actions, supported by Ares
-- All script actions including Ares (65 to 70) are updated with latest information 
and parameter settings (changes applicable only if using FA2Ext.dll)

Changes (2020-09-05):
- Script action Change house (20,n) dropdown changed to country list for index selection.
- Few description changes in FAData.ini for actions and events.

Changes (2020-09-02):
- Ease of use UI changes like dropdown size increase, consecutive window's button location sync.
- Included Ambient calc tool for map action 71 and 72.
- Map action 88 now shows ParticleSystems list in the dropdown instead of Particles. 
- FAData.ini changes
-- Desert trees with lower IDs made available
-- Few trees, lamps and other objects made available
-- Parameter type corrections and changes
-- Additional info and corrections for few events 
-- Corrections/changes for actions 8, 25, 26, 27, 40, 42, 43, 44, 45, 48, 52, 58, 
71, 72, 73, 88, 89, 90, 94, 96, 104, 105, 112, 114, 116, 128, 137 and 140.
-- Ares events 62 to 88 added
-- Ares actions 146 to 149 added

Note: When applying mods like TX (Terrain Expansion) which changes FAData.ini, it is advised to merge 
the contents with a diff tool instead of overwriting the file so that the corrections or changes are not lost.

Changes (2020-05-10):
- Dropdown heights increased so as to minimize the use of scrollbars.
- Search waypoints window improved.
- Veteran status text appended with (0-200) for pre-placed units in FALanguage.ini for English.
- Tab stop orders changed for most of the windows.

Changes (2020-05-04): 
- AI Trigger window improved. Unused Base Defense value is unchecked by default when creating new trigger. 
- Tab stop orders changed in a few windows. 

Changes (2020-04-03): 
- Hotkeys for menu items. 

Changes (2019-12-26): 
- Second row in toolbar is removed and buttons from it merged to first row. 
- Default global AI Trigger enable checkbox is set as unchecked in new map creation window. 
- Disabled Beginner mode by default on first run. 
- Unit window text changed from Follows ID to Follower's ID in FALanguage.ini. 

Changes (2019-08-31): 
- New map default size set to 80x80 (was 50x50). 
- New TeamType default value for Full and Autocreate checkboxes set to no (was yes). 

Changes (2019-08-30): 
- Added map size limits message for the tool to Map resize UI and script. 

Changes (2019-08-29): 
- Map resize through Map popup window upper limit raised from 200 to 511. 
- Resize script added to the Scripts folder. 
- Descriptions changed in Tags, ScriptType, TaskForce etc. windows and FALanguage.ini is updated. 

Changes (2019-08-27 Patch 2): 
- Map resize through tool script restriction raised from 200 to 511. 

Changes (2019-08-27 Patch 1): 
- On new map creation, default LocalSize (visible area) is now set to 3,5,Width-6,Height-11 (was 2,4,Width-4,Height-6). 
- Trigger Editor window: Size of description box for action and event tabs is increased so that the descriptions 
can be viewed without scrolling. 

Changes (2019-08-26): 
- More undo/redo (from 15 to 127) hack applied (from cybermind). 
- Repeat/AND/OR dropdown fixes for Trigger and Tag windows 
- Ignore RA2 install path from the registry and use path from FinalAlert.ini 
only. It enables having individual copies of FA2 for mods. 
- Low volume sound. 
- New map creation window limit of 200 size for width/height extended with instructions. 
- Reference ecahemd changed to expandmd. 
- FALanguage.ini is modified for high bridge frame's usage. Changes are done for English only. 
- Status bar coordinates are shown as X / Y - H (was Y / X - H). 
- Edit menu items re-ordered and Edit menu popup windows now open centered by default. 
- Teams window: Resized and checkbox options are given some space. 
- AI Trigger Types window: Side dropdown entry changed from 0 None to 0 All, 
renamed Multi-Side to Side, Weight to InitialWeight and Unittype to TechnoType. 
- Infantry, Unit and Aircraft windows: Resized and arranged components, changed Recruitable to 
AutocreateNo Recruitable and AI Recruitable to AutocreateYes Recruitable in FALanguage.ini for English. 
- On new map creation, default LocalSize (visible area) is now set to 2,5,Width-4,Height-11 (was 2,4,Width-4,Height-6). 
This is to compensate for in-game blackening of the top row and bottom rows cuttoff. 
- New map creation minimum WidthxHeight is now set to 20x20 (was 16x16). Warning message on map creation 
are set for less than 20 (was 16) and greater than 511 (was 200). Warning message for Width+Height being greater 
than 256 is extended to 512. 

#################################################
#################################################

Details of changes:

1. More undo/redo hack from cybermind, raised from 15 to 127:
https://ppmforums.com/viewtopic.php?p=551827#551827

2. Resource hacking for Repeat/AND/OR dropdown fixes:
https://ppmforums.com/viewtopic.php?t=39454

3. Sounds volume have been reduced.

4. Ignore RA2 install path from the registry and use path from FinalAlert.ini only. It allows having individual copies of FA2 for mods. Hack is same as was done by CCHyper and shared by Bittah Commander for FinalSun.

[IgnoreRegistryFA2]
Name=Use FinalAlert.ini RA2 install path
Description=Ignore the RA2 install path from the registry and always use the one from FinalAlert.ini.
Type=FinalAlert2
Offset=0x1FDDB
Original=55 68 3C B1 5C 00 50 55 FF 15 6C 15 59 00
Modified=90 90 90 90 90 90 90 90 90 90 90 90 90 90
Offset=0x1FFDF
Original=55 68 3C B1 5C 00 50 55 FF 15 6C 15 59 00
Modified=90 90 90 90 90 90 90 90 90 90 90 90 90 90
Offset=0x1CB4A4
Original=53 6F 66 74 77 61 72 65 5C 57 65 73 74 77 6F 6F 64 5C 52 65 64 20 41 6C 65 72 74 20 32
Modified=00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00

5. Raised the map width, height limit from 200 to 511 on the new map creation screen along with its instructions. Avoid crossing limit of W + H <= 512 and W * H < ~43500 which could cause glitches/crash/hang in FA2.

[MapSizeFA2]
Name=Raises the map width, height limit from 200 to 511.
Description=Raises the 200 limit to 511 when creating new maps.
Type=FinalAlert2
Offset=0xD2F4F
Original=C8 00
Modified=FF 01
Offset=0xD2F59
Original=C8 00
Modified=FF 01

6. Reference to ecahemd is changed to expandmd.

7. FALanguage.ini is modified for high bridge frame's usage. Overwrite the one in the FA2 folder with the one provided. Changes are done for English only. For details check: 
https://ppmforums.com/viewtopic.php?p=572963#572963

8. The coordinates shown on the status bar are now reversed to show X / Y - H (was Y / X - H).

[StatusBarYXToXYFA2]
Name=Statusbar coordinates to be shown as X / Y - H instead of Y / X - H
Description=Coordinates on the statusbar reversed to show X / Y instead of Y / X.
Type=FinalAlert2
Offset=0x5AEFF
Original=8B 7C 24 38 8D 8C 24 58 04 00 00 6A 0A 51 57
Modified=8B 5C 24 30 8D 84 24 58 04 00 00 6A 0A 50 53
Offset=0x5AF40
Original=8B 5C 24 30 8D 84 24 58 04 00 00 6A 0A 50 53
Modified=8B 7C 24 38 8D 8C 24 58 04 00 00 6A 0A 51 57

9. Edit menu items re-ordered and Edit menu popup windows now open centered by default.

10. Teams window: Resized and checkbox options are given some space.

11. AI Trigger Types window: Side dropdown entry changed from 0 None to 0 All, renamed Multi-Side to Side, Weight to InitialWeight and Unittype to TechnoType.

12. Infantry, Unit and Aircraft windows: Resized and arranged components, changed Recruitable to AutocreateNo Recruitable and AI Recruitable to AutocreateYes Recruitable in FALanguage.ini for English. 

13. On new map creation, default LocalSize (visible area) is now set to 3,5,Width-6,Height-11 (was 2,4,Width-4,Height-6). This is to compensate for in-game blackening of the top row, bottom rows cuttoff and increasing 1 cell gap on the sides.
Addresses: 0xB8A77 FC to FA, 0xB8AAB from FA to F5, 0xC5E05 from FC to FA, 0xC5E3A from FA to F5, 0x1CFE20 from 32 to 33 and 0x1CFE22 from 34 to 35.

14. New map creation minimum WidthxHeight is now set to 20x20 (was 16x16). Warning message on map creation are set for less than 20 (was 16) and greater than 511 (was 200). Warning message for Width+Height being greater than 256 is extended to 512.
Addresses: 0xD2F61 from 10 to 14, 0xD2F66 from 10 to 14, 0xD2F6D from 01 to 02, 0x1D0206 from 31 36 to 32 30, 0x1D020D from 32 30 30 to 35 31 31 and 0x1D0232 from 32 35 36 to 35 31 32.

15. Trigger Editor window: Size of description box for action and event tabs is increased so that the descriptions can be viewed without scrolling.

16. Map resize through tool script restriction raised from 200 to 511. Script can contain command like Resize("PositionX","PositionY","NewWidth","NewHeight"); where the parameters are number in cells. For example:
Resize("-8","0","204","207"); // will resize the currect map to new size of 204x207 and place the map contents shifted by 8 cells to the left.
Addresses: 0x1131A5 from C8 00 to FF 01 and 0x1131C3 from C8 00 to FF 01.

17. Map resize through Map popup window upper limit raised from 200 to 511. A second warning message changed to values between 20 to 511 (was 16 and 250) .
Addresses: 0x1B10A and 0x1B138 from C8 00 to FF 01. 0x99D5C, 0x99D75 from 10 to 14 and 0x99D65, 0x99D7D from FA 00 to FF 01. 0x1CF909 from 31 36 to 32 30 and 0x1CF910 from 32 35 30 to 35 31 31.

18. Resize script added to the Scripts folder.

19. Descriptions changed in Tags, ScriptType, TaskForce etc. windows and FALanguage.ini is updated.

20. Added map size limits for the tool to Map resize UI and script.

21. New map default size set to 80x80 (was 50x50).
Addresses: 0xD2F14 from 32 to 50.

22. New TeamType default value for Full and Autocreate checkboxes set to no (was yes).
Addresses: Full - 0xEEEC0 from 20 A6 to 2C B4 and Autocreate - 0xEF138 from 20 A6 to 2C B4.

23. Toolbar - second row removed and buttons from it merged to first row. Brush size also touched for position.
Resources changed - Bitmap [225 : 1031], resource [241 : 225 : 1031].
Second row hiding address - 0x24250 from 03 to 04 (Credits: Bittah Commander).

24. Default global AI Trigger enable checkbox is set as unchecked in map creation window. Text resources related to AI Triggers enabling changed.
Addresses:  0xD2D42 from 01 to 00.

25. Disable Beginner mode (and thereby no message of beginner/advanced modes) by default on first run. Text changed for new map creation radio button for singleplayer map.
Addresses: 0x21BCE from 8A 44 24 1F to 90 90 B0 00

26. Unit window text changed from Follows ID to Follower's ID in FALanguage.ini for English.

27. Hotkeys for menu items. Menu and accelerator resources updated.

28. AI Trigger window improved. Unused Base Defense value is unchecked by default when creating new trigger.
Address 0x1CA6C0 from 31 to 30.

29. Tab stop orders changed in several windows.

30. Dropdown heights increased so as to minimize the use of scrollbars.

31. Search waypoints window improved.

32. Veteran status text appended with (0-200) for pre-placed units in FALanguage.ini for English.

33. Map action 88's dropdown list change from Particles to ParticleSystems
Addresses: 0x43293, 0x43357, 0x4345E, 0x43558 from 30 D9 5C to 80 57 5D
0x1D5780  from 00 00 00 00 00  00 00 00 00 00 00 00 00 00 00 to 50 61 72 74 69 63 6C 65 53 79 73 74 65 6D 73 (Hex for text ParticleSystems)

34. Script action Change house (20,n) dropdown changed to country list from house list
Addresses: 0xD6E4C from 53 8D 8E 4C 01 00 00 to E9 12 08 00 00 90 90
0xD7663 from 90 90 90 90 90 90 90 90 90 90 90 90 90 to 6A 01 8D 8E 4C 01 00 00 E9 E3 F7 FF FF

35. Not to change map extension when saving 
Address: 0x2703A from 85 C0 to EB 51

36. For default/new building direction to be changed from 64 to 0 
Address - 0xACD29 from 5C DE to 00 A7

37. Local variables, raise dropdown show limit from 100 to a big number (0xFFFFFFFD unsigned).
Address - 0x483B3 from 64 0F 8C to FD 0F 86

38. For RA2 only multiplayer maps, remove display of Multi-Player (0-7) trigger dropdown entries.
Addresses: 0x45582 from A4 to 9F and 0x45591 from 95 to 90.

#################################################
