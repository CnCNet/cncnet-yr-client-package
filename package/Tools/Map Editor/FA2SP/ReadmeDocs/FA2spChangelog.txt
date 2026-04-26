# FINALALERT2 - SP  CHANGELOG

## RELEASE 1.6.3 (2023-11-22)
- New ***ExtConfig*** : `ExtVariables` = **BOOLEAN**, defaults to false
- New ***ExtConfig*** : `FileWatcher` = **BOOLEAN**, defaults to true
- Add shortcuts to some online websites
    - [FA2sp Github Page](https://github.com/secsome/FA2sp), translation key: `Menu.Online.FA2sp`
    - [Phobos Github Page](https://github.com/Phobos-developers/Phobos), translation key: `Menu.Online.Phobos`
    - [PPM Forum MainPage](https://www.ppmforums.com/), translation key: `Menu.Online.PPM`
    - [ModEnc MainPage](https://modenc.renegadeprojects.com/Main_Page), translation key: `Menu.Online.ModEnc`
    - You can also add your own shortcuts (3 at max) by editing `FAData.ini` section `[Online]`
        - This feature might be vulnerable in some cases, so it is disabled by default, you can enable it by setting ***ExtConfig*** : `CustomOnlineWebsites` = **BOOLEAN**, defaults to false
    ```ini
    ; In `FAData.ini`
    [OnlineWebsites]
    Custom1=My Website Name 1,https://website1.com
    Custom2=My Website Name 2,https://website2.com
    Custom3=My Website Name 3,https://website3.com
    ```

## RELEASE 1.6.2 (2023-07-18)
- Renamed ***ExtConfig*** : `BrowserRedraw.GuessMode` to `ObjectBrowser.GuessMode`
- Renamed ***ExtConfig*** : `BrowserRedraw.CleanUp` to `ObjectBrowser.CleanUp`
- Renamed ***ExtConfig*** : `BrowserRedraw.SafeHouses` to `ObjectBrowser.SafeHouses`
- Now buildings whose hp percentage lower than `[AudioVisual]>ConditionYellow` will be displayed as damaged one
- Now buildings whose hp is 0 will be displayed as their rubble frame
    - Currently the rubble will probably be drawn with an incorrect palette
- New ***ExtConfig*** : `HideNoRubbleBuilding` = **BOOLEAN**, defaults to false, enable it so Buildings with `LeaveRubble=no` will be hide if their HP = 0
- New ***ExtConfig*** : `MultiSelectionShiftDeselect` = **BOOLEAN**, defaults to false, enable it so deselect all hotkey would be CTRL+SHIFT+D, otherwise it would be CTRL+D
- Added hotkey CTRL+SHIFT+F for Navigate to coordinate
- SliderCtrl now displays tooltip indicating current strength of the object
- Now Map Editor will hint if the map file had been externally modified. Can be translated by `FileWatcherMessage`.

## RELEASE 1.6.1 (2023-05-06)
- New Map Tool: Navigate to coordinate, can be translated by `Menu.MapTools.NavigateCoordinate`, more locolization tags could be found in the document
- Fixed the bug that Taskforce window didn't translate message properly
- ***ExtConfig*** : `EnableMultiSelection` defaults to true since this version. This tag is supposed to be deprecated in 1.7.0.

## RELEASE 1.6.0 (2023-04-30)
- **ONLY YURI's REVENGE WILL BE SUPPORTED SINCE FA2SP 1.6.0**
- Reimplemented file reading system
- Support Ares Custom Foundation
- Map validator now checks overlapping structures, raise an error instead of warning for now. String can be modified by `MV_OverlapStructures`
    - **You should manually add buildings that need to be ignored in `FADATA.INI` section `[StructureOverlappingCheckIgnores]`, as it is raising an error, and you probably want some lightposts to be ignored.**
    - The Ignorance list might be removed in the future, when I can finally figure out what is that stupid problem
- Map validator now checks missing logic params, raise an error instead of warning for now. String can be modified by `MV_LogicMissingParams`
- Fixed the bug that lighting is not reset correctly when loading/creating a map
- Fixed the bug that smudges and basenodes drifting away when resizing the map
- Multiselection now supports copy & paste
- Multiselection operations(raise or lower cells) now supports undo & redo
- New ***ExtConfig*** : `ExtendedValidationNoError` = **BOOLEAN**, defaults to false

## RELEASE 1.5.2 (2023-03-03)
- Fixed the bug that money calculation is incorrect
- Now SHP Vehicles more than 8 facings are supported
- New ***ExtConfig*** : `EnableMultiSelection` = **BOOLEAN**, defaults to false

## RELEASE 1.5.1 (2023-01-12)
- Fixed the bug that Preview was incorrectly saved in version 1.5.0
- Built-in script params can be translated
- Trigger repeat type can be translated

## RELEASE 1.5.0 (2023-01-03)
- Implement Auto Property Brush
- New ***ExtConfig*** : `DDrawInVideoMem` = **BOOLEAN**, defaults to true
- New ***ExtConfig*** : `DDrawEmulation` = **BOOLEAN**, defaults to false
- New ***ExtConfig*** : `NoHouseNameTranslation` = **BOOLEAN**, defaults to false

## RELEASE 1.4.2 (2022-10-27)
- Split `CncVxlRenderText`
- New ***ExtConfig*** : `RandomTerrainObjects` = **BOOLEAN**, enable it so `random trees` will show all `TerrainTypes`.
- Fixed a bug when saving `[PreviewPack]` and `[Preview]`

## RELEASE 1.4.1 (2022-06-18)
- *This is a **cumulative** update*
- Reimplemented CTeamTypes message handler
- Support for lower case of theater names
- Fix a possible memory leak
- Disable `MultiSelection`
- Optimizations on UI
- Put `Preview` and `PreviewPack` at the beginning of the map file if they exist
- Update the changelog file and document file, now really using **Markdown**

## RELEASE 1.4.0.1 (2022-02-11)
- Fixed the bug that Powerups are not being rendered in several cases
- Fixed the bug that MoneyCounter is not working properly

## RELEASE 1.4.0 (2022-02-10)
- Now you can create a map with size up to $255$ * $255$
- New ***ExtConfig*** : `RecentFileLimit` = **INTEGER**, defaults to $6$, should be a integer between $4$ and $9$ 
- Optimized mouse attached building drawing
- Reimplemented tube generation
- Support for multi-selection, the detailed usage can be looked up in the document below
- New ***ExtConfig*** : `MultiSelectionColor` = COLORREF, back color of selected tiles
- Theater order in dropdown is now customizable and theaters can be disabled
- New ***ExtConfig*** : `Waypoint.Text.ExtraOffset` = POINT, WP text offsets
- New ***ExtConfig*** : `SaveMap.DefaultPreviewOptionMP` = **INTEGER**, `SaveMap.DefaultPreviewOptionSP` = **INTEGER**, read the doc below
- ***ExtConfig*** : `SaveMap` tag has been removed, it will be forced to enable now

## RELEASE 1.3.0 (2021-12-31)
- The project now compiles under **v143** with `/std:c++latest`, **Windows XP** may **not** be able to use this dll
- New ***ExtConfig*** : `FastResize` = **BOOLEAN**, enable it so resizing the map will be much more faster when expanding
- Experimental Lighting, only for preview, not correct
- More localization support
- Added more internal param codes
- You can now customize tile manager by **regex**
- Reimplement waypoint drawing, reduce lag
- Minor adjustments

## RELEASE 1.2.2 (2021-11-20)
- Now you can add more ramps to be auto generated in FA2 by setting `[THEATERInfo]` in `fadata.ini`
- Now you can specify the **display** name of theaters
- Support for ExtraMixes, will be read **before any other** mixes
- Support for OverlayDisplayLimit, the frame after this number won't be displayed in the TilesetBrowserView, up to 60
- ***ExtConfig*** : `Stringtable` tag has been **removed**, it will be **forced to enable** now
- Minor fixes

## RELEASE 1.2.1 (2021-11-12)
- Remove a hook that might lead to some problem
- Adjust some rc file
- Fixed `BrowserRedraw.SafeHouses` not working correctly
- Now property brush handles mouse move too

## RELEASE 1.2.0 (2021-11-04)
- New ObjectBrowser items: **Property brushes** (`FALanguage` has been updated)

## RELEASE 1.1.3 (2021-11-02)
- Fixed the bug that `EVA(md).ini` cannot be loaded
- Now ScriptsRA2 will correctly read inconsistent keys
- New ***ExtConfig*** : `BrowserRedraw.SafeHouses`, enable it so that the houses being displayed in ObjectBrowserView will be rearranged correctly but won't update until you load the map again

## RELEASE 1.1.2 (2021-10-16)
*) Fixed the bug that FA2sp crashes while trying to read/write file on some PCs

## RELEASE 1.1.1 (2021-10-12)
- Minor bugfixes
- Now FA2sp will apply Visual Style depending on your system **instead of** keeping them look like **Windows95** style

## RELEASE 1.1.0 (2021-10-03)
- Trigger sort, which will provide you some handy in trigger classification
- Now you can directly edit `[Ranking]` in SingleplayerSettings
- Now you can edit all stuff of `[Lighting]`
- New ***ExtConfig*** : `VerticalLayout` = **BOOLEAN**, enable it so that FA2sp will make the bottom view go to the right side
- Now you can delete a trigger and its celltags at the same time
- Now you can customize script param typelist

## RELEASE 1.0.7 (2021-09-28)
- Changed the layout of CRightView::CTileSetBrowserFrame from [0, 1] to [1, 0], it's vertical now
- Now FA2 will not only read default palettes from cache.mix but read them like the normal files
- Fix the remaining autosave bug cannot removing earlier maps
- Fix the bug that Multiplayer map cannot save PreviewPack correctly

## RELEASE 1.0.6 (2021-09-23)
- Fix the autosave bug caused by Loritas
- Fix the problem that FA2 crashes after kill focus
- Fix the problem that Allie Editor not being applied to the data automatically
- Fix the bug that resize map not take basenodes and smudges into consideration

## RELEASE 1.0.5 (2021-08-25)
- Enhanced SaveMap logic by Loritas
- New ***ExtConfig*** : `SaveMap.OnlySaveMAP`, enable it so that FA2 will only save map with .map file extension
- Now VXL drawing lib no longer requires DirectX 9 anymore
- Reimplemented Building & Basenode outline rendering, also Celltags, Waypoints and Tubes rendering
- **Significantly** reduce the lag of Building & Celltag & Waypoint & Tube rendering

## RELEASE 1.0.4 (2021-08-20)
- Now you can copy *AITriggers*
- New ***ExtConfig*** : `SaveMap` = **BOOLEAN**, enable it so that we will replace FA2's vanilla slow saving function
    - New ***ExtConfig*** : `SaveMap.AutoSave` = **BOOLEAN**, enable it so that we will enable FA2 to save map automatically after one save
        - New ***ExtConfig*** : `SaveMap.AutoSave.Interval` = **INTEGER**, set the interval between two auto saving, need to be greater than or equal to than `30`
        - New ***ExtConfig*** : `SaveMap.AutoSave.MaxCount` = **INTEGER**, how many auto saving files can FA2 keep, set to `-1` will disable the auto cleanning up

## RELEASE 1.0.3 (2021-08-19)
- Now we read file without extracting them to the game folder, this might fix some reading bugs
- The ObjectBrowserView will show player locations again in Multiplayer maps (with Basic -> MultiplayerOnly=yes)
- **Easy mode** is disabled, and it won't be displayed in menu either anymore

## RELEASE 1.0.2 (2021-08-18)
- Now Allie Editor answer double click command for listboxes
- Fixed the bug that TransportWP was not correctly copied
- ScriptTypes and VXLDrawing will no longer cause memory leak

## RELEASE 1.0.1 (2021-08-14)
- Now `Unit/Aircraft/Infantry` dialog will show up at the center of the screen
- Fixed the bug that delete script do not delete the key in `[ScriptTypes]`
- Fixed the bug that copy team do not really clone `Droppod` key

## RELEASE 1.0.0 (2021-08-13)
- Minor adjustments on ObjectBrowserControl
- Replace the exception handler, now you can save a dmp file when FA2 crashes
- Fix the bug that some building cannot be drawn correctly

## Build20210811 (2021-08-11)
- VXL Units' TurretOffset and Buildings' VXL turrets should be drawn at correct place
- New ignore keys: `IgnoreIdleAnim` and `IgnoreActiveAnimX`
- New drawing config: `VehicleVoxelBarrelsRA2`
- `IgnoreSuperAnimX` will be read correctly now
- Import AllieEditor for CHouses from FA2Copy
- Adjustments on several dialogs
- Now you can run *multiple* FA2sp at the same time

## Build20210807B (2021-08-07)
- Fixed the bug for PowerUpLocs

## Build20210807 (2021-08-07)
- The drawing function is fixed for several items
- The Isoview now will be redrawn automatically after layers are set
- New tags in falanguage so you can translate menu items

## Build20210806 (2021-08-06)
- New param code: $30$ for **float**, this param code can be used for action $71$ & $72$
- New menu checkboxes: **Layers**, you can hide Strutures, Infantries and so on through this system
- The drawing function for Structures, Infantries, Vehicles, Terrains, Smudges and Aircrafts have been **completely rewritten**

## Build20210802 (2021-08-02)
- Fixed fatal error on STDHelper::SplitString caused bugs on Clone Actions/Events and ***ExtConfig***::`SortByTriggerName`

## Build20210731 (2021-07-31)
- Fixed wrongly painted infantry subcell place
- Undo/Redo limit is now controlled by ***ExtConfig*** : `UndoRedoLimit` = **INTEGER**, defaults to $16$
- New ***ExtConfig*** : `UseRGBHouseColor`
- Now you can copy single action/event in trigger editor
- Now you can copy taskforce and its member

## Build20210719 (2021-07-19)
- Undo/Redo extended to $2147483647$ steps, be careful about your memory
- Fixed wrongly painted Remap color for technos using `UNITXXX.PAL`
- Fixed buildings with shp turret can only been painted to NORTH
- Refactored ScriptTypes window, now you can use `MoveUp`, `MoveDown`, `InsertMode` and `Clones`

## Build20210611 (2021-06-11)
- New ***ExtConfig*** : `ExtWaypoints` = **BOOLEAN**, enable it to support no limitation of waypoints, defaults to false (Phobos required)
- New ***ExtConfig*** : `Waypoint.Background` = **BOOLEAN**, enable it to draw a background rectangle for waypoints, defaults to false
    - New ***ExtConfig*** : `Waypoint.Background.Color` = **COLORREF**, custom the waypoint background color
- New ***ExtConfig*** : `Waypoint.Color` = **COLORREF**, custom the waypoint text color
- New ***ExtConfig*** : `CopySelectionBound.Color` = **COLORREF**, custom the copy selection bound color, defaults to $255,0,0$
- New ***ExtConfig*** : `CursorSelectionBound.Color` = **COLORREF**, same as the above one, defaults to $60,160,60$
- New ***ExtConfig*** : `CursorSelectionBound.HeightIndicatorColor` = **COLORREF**, same as the above one, defaults to $60,60,60$

## Build20210507 (2021-05-07)
- New ***ExtConfig*** : `SortByTriggerName` = **BOOLEAN**, enable it so FA2 will sort the triggers dropdown and sort them by their name instead of ID
- New ***ExtConfig*** : `AdjustDropdownWidth` = **BOOLEAN**, enable it so FA2 will adjust the param dropdown width automatically
    - New ***ExtConfig*** : `AdjustDropdownWidth.Factor` = **INTEGER**, determines how long is a single char takes, defaults to $8$
    - New ***ExtConfig*** : `AdjustDropdownWidth.Max` = **INTEGER**, determines the max length of the combobox, defaults to $360$
- Remove ***ExtConfig*** : `OverlayFilter`, enable it always.

## Build20210322 (2021-03-22)
- Now you can force to use Name first instead of UIName in the ObjectBrowserControl under `[ForceName]` just like `[IgnoreRA2]`
- More accelerators and fixes from E1Elite

## Build20210305 (2021-03-05)
- Now the game directory FA2 reads would use the path in FinalAlert.ini instead of the one in registry
- Coordinates are now shown as X / Y - H
- Undo/Redo extended to $127$ steps (was $15$ steps)
- ObjectBrowserControl refactored
    - Not only Buildings, but Infantrys, Aircrafts and Vehicles now have been classified into sides
    - Not only the original hardcoded overlays but also all overlays having `Wall=yes` will be auto connected
- Now infantry's facing will be correctly shown
- Overlay which has the index bigger than $255$ will be ignored
- Teamtypes and Scripttypes are now able to use Clone just as Triggers
- House colors will be correctly drawn instead of using a hardcoded set of colors (for most, yellow)
- For most dialogs, the content will only be updated while lose focus. (Used to be content changed, and lead to famous stupid lag teamtype) 
- Several dialogs UI Redrawn
- Support Ares' += and #include functions (not recommended to use, still has several bugs)
- Support Ares' stringtableXX.csf
- ScriptTypes now use a different set of params and can be extended
- Mix Extension and INI Filenames can be customed
- `Ctrl+S`, `Ctrl+O`, `Ctrl+N` and `Ctrl+Shift+S` are now supported
- Easy encrypted mix files will be correctly read
- Tile manager, can be helpful while you are having lots of tiles