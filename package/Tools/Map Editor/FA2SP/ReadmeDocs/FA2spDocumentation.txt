# FINALALERT2 - SP  DOCUMENT

## GETTING START
- Just like Ares, FA2sp needs Syringe to work properly, so you can just take Ares as a reference.
- What you need to know is that FA2sp requires Vanilla FinalAlert 2 1.02, any modified version may lead to unexpected errors!
- Before you launch it for the first time, write the ini files below properly, especially for essential ones (marked by **x**).
- If you still have any problem about it or something wrong occured while using it, please contact me directly or mail me at 3179369262@qq.com.
- Now you can also join Discord server https://discord.gg/k4SVuMm, and found `map-editors` under `DEDICATED PROJECTS`.
- For now, I cannot ensure the stability of it, so save your maps frequently before heavy loss! XD

The multiple selection function is now available. Press Ctrl key to select tiles and press Ctrl+Shift key to deselect them. Ctrl+D can clear all selected tiles.
Now this feature supports RaiseSingleTile/LowerSingleTile (though they are not "Single" anymore), copy paste, and calucating selected area ore value.

## BASIC TYPES
- **INTEGER** 
  - Ranges in $[-2147483648,2147483647]$
    - $-1$ $|$ $2$ $|$ $114514$
- **POINT** 
  - **INTEGER**, **INTEGER**
    - $1, 2$ $|$ $114514, 1919810$
- **BOOLEAN** 
  - $Yes/No$, $True/False$, $1/0$
    - $Yes$ $|$ $true$ $|$ $1$
- **COLORREF** 
  - R,G,B each of them ranges in $[0,255]$
    - $255, 255 ,0$ $|$ $0, 0, 60$

## BASIC TYPES
- FAData.ini
    - [ExtConfigs]
        - **ObjectBrowser**, if `ModernObjectBrowser` is enabled, `BrowserRedraw` won't be useful
            - `BrowserRedraw` = **BOOLEAN** ; Enable refactored ObjectBrowserView 
            - `ModernObjectBrowser` = **BOOLEAN** ; If this value is true, then experimental object browser will be enabled, replacing the vanilla tree view, defaults to **false**
                - `ObjectBrowser.GuessMode` = **$0/1$** ; Determines how FA2sp guess Technos' side, $0$(Default) to Prerequisite, $1$ to use first Owner 
                - `ObjectBrowser.CleanUp` = **BOOLEAN** ; Sides classification will clear empty items
                - `ObjectBrowser.SafeHouses` = **BOOLEAN** ; Determines whether FA2sp will rearrangement the houses or not
        - `AllowIncludes` = **BOOLEAN** ; Read #include section for other ini (NOT RECOMMENDED) 
        - `AllowPlusEqual` = **BOOLEAN** ; Read += (NOT RECOMMENDED)
        - `TutorialTexts.Fix` = **BOOLEAN** ; Replace original process while loading texts to comboboxes
        - `TutorialTexts.Hide` = **BOOLEAN** ; Reduce lags, for texts in combobox might be useless
        - `SortByTriggerName` = **BOOLEAN** ; Enable this feature so we can sort the triggers by their names
        - `AdjustDropdownWidth` = **BOOLEAN** ; Enable it so FA2 will adjust the param dropdown width automatically
            - `AdjustDropdownWidth.Factor` = **INTEGER** ; Determines how long is a single char takes, defaults to $8$
            - `AdjustDropdownWidth.Max` = **INTEGER** ; Determines the max length of the combobox, defaults to 360
        - `CopySelectionBound.Color` = **COLORREF** ; Determines the color of the selection boundary while copying, defaults to $255,0,0$
        - `CursorSelectionBound.Color` = **COLORREF** ; Determines the color of the boundary for current cell, defaults to $60,160,60$
        - `HeightIndicatorColor.Color` = **COLORREF** ; Determines the color of the height indicator for current cell, defaults to $60,60,60$
        - `Waypoint.Color` = **COLORREF** ; Determines the color of waypoint texts, default to $0,0,255$
        - `Waypoint.Background` = **BOOLEAN** ; Determines whether draw a rectangle background for waypoints or not. defaults to false
        - `Waypoint.Background.Color` = **COLORREF** ; Determines the color of the waypoint background, defaults to $255,255,255$
        - `Waypoint.Text.ExtraOffset` = **POINT** ; Additional X and Y-axis offset for waypoint text, defaults to $0,0$
        - `ExtWaypoints` = **BOOLEAN** ; Determines if FA2sp supports unlimited count of waypoints, defaults to **false** (Phobos required)
        - `UndoRedoLimit` = **INTEGER** ; Determines the maximun step of undo/redo, defaults to $16$
        - `UseRGBHouseColor` = **BOOLEAN** ; Determines if House colors are recognized as RGB color instead of HSV, defaults to **false** 
        - `SaveMap.AutoSave` = **BOOLEAN** ; Determines if FA2 will save map automatically
            - `SaveMap.AutoSave.Interval` = **INTEGER** ; Should be greater than or equal to $30$, defaults to $300$, determines how many seconds should we wait during the two auto saving
            - `SaveMap.AutoSave.MaxCount` = **INTEGER** ; How many saving should FA2 keep, set to $-1$ will disable the auto cleanning, defaults to $10$
        - `SaveMap.OnlySaveMAP` = **BOOLEAN** ; Determines if FA2 will only save map with *.map* file extension
        - `SaveMap.DefaultPreviewOptionMP` = **INTEGER** ; Default radio option button for preview generation when saving multiplayer maps 
          - $0$ = Always generate new preview
          - $1$ = Do no generate new preview
          - $2$ = Always generate hidden preview
          - defaults to $0$.
        - `SaveMap.DefaultPreviewOptionSP` = **INTEGER** ; Same as the **MP** one but for **SP** maps, defaults to $1$
        - `VerticalLayout` = **BOOLEAN** ; Determines if FA2 will make the bottom view go to the right side
        - `RecentFileLimit` = **INTEGER** ; How many recent files should I keep? ranges from $4$ to $9$
        - `MultiSelectionColor` = **COLORREF** ; Determines the back color of selected tiles
        - `MultiSelectionShiftDeselect` = **BOOLEAN** ; Determines the hotkey of deselect all multiselected cells would be CTRL+SHIFT+D(**true**) or CTRL+D(**false**), defaults to **false**
        - `RandomTerrainObjects` = **BOOLEAN** ; Determines if FA2 will display all terrain objects in random tree dialog, defaults to **false**
        - `DDrawInVideoMem` = **BOOLEAN** ; Determines if FA2 will allocate DirectDraw surface in the video memory, defaults to **true**
        - `DDrawEmulation` = **BOOLEAN** ; Determines if FA2 will use emulation mode for DirectDrawCreate, defaults to **false**
        - `NoHouseNameTranslation` = **BOOLEAN** ; Determines if FA2 will translate house to their UIName, defaults to **false**
        - `EnableMultiSelection` = **BOOLEAN** ; Determines if FA2sp will enable expermental multi-selection features, defaults to **false**
        - `ExtendedValidationNoError` = **BOOLEAN** ; If this value is true, then extended map validation won't be shown as error but warning, defaults to **false**
        - `HideNoRubbleBuilding` = **BOOLEAN** ; If this value is true, then building whose HP = 0 with `LeaveRubble=no` won't be rendered, defaults to **false**
        - `ExtVariables` = **BOOLEAN** ; Determines if FA2sp supports unlimited count of local variables, defaults to **false** (Phobos required)
        - `FileWatcher` = **BOOLEAN** ; Determines if FA2sp will detect if map file is modified external, defaults to **true**
        - `CustomOnlineWebsites` = **BOOLEAN** ; Determines if FA2sp will read custom online websites
    - - **`[Sides]`** (**x** means this item is **essensial**, fa2sp need this section to work properly)
        - Contains a list of sides registered in rules
        ```ini
        [Sides]
        0=Allied
        1=Soviet
        2=Yuri
        3=Neutral
        4=Special
        ```
    - `[Theaters]`
        - Contains a list of theater names, only the existing 6 names are valid. If not listed then all default 6 theaters are used and displayed in order below:
        ```ini
        [Theaters]
        0=TEMPERATE
        1=SNOW
        2=URBAN
        3=NEWURBAN
        4=LUNAR
        5=DESERT
        ```
    - `[ForceName]`
        - xxx = Objecttype
        - Contains a list of objecttypes forced to use Name instead of UIName
        ```ini
        [ForceName]
        0=E1
        ```
    - `[ForceSides]`
        - Technotype = SideIndex
        - Contains a list of technotypes whose side cannot be correctly guessed
        ```ini
        [ForceSides]
        ENGINEER=0
        SENGINEER=1
        YENGINEER=2
        ; A LOT OF WESTWOOD CIVILIAN VEHICLES WITH PREREQUISITE 
        ; [NAWEAP] WILL BE GUESSED INTO SOVIETS, FIX THEM MANUALLY
        ```
    - `[ObjectBrowser.SmudgeTypes]` and `[ObjectBrowser.TerrainTypes]`
        - Contained string = translation key in falanguage
        ```ini
        [ObjectBrowser.SmudgeTypes]
        CRATER=SmudgeCraterObList
        BURNT=SmudgeBurntObList
        
        [ObjectBrowser.TerrainTypes]
        TREE=TreesObList
        TRFF=TrafficLightsObList
        SIGN=SignsObList
        LT=LightPostsObList
        ```
    - `[TileManagerDataXXX]` *TEM, SNO, URB, UBN, LUN, DES*
        - DisplayName = Regex expression
        ```ini
        [TileManagerDataTEM]
        Cliff=cliff
        Water=water
        Ramp=ramp|slope
        Bridge=bridge
        Road=road|highway
        Feature=feature|farm
        Railway=rail|train
        Tunnel=tunnel|tube
        Ramp=ramp|slope
        Shore=shore
        Pavement=pave
        Fix=fix
        LAT=lat
        ```
    - `[XXXInfo]` *TemperateInfo, SnowInfo, UrbanInfo, NewUrbanInfo, DesertInfo, LunarInfo*
        - `Ramps=Tilesets`
        - `Morphables=Tilesets`
          - All tilesets here should have `Morphable=true`. You don't need to write RampBase here, only other ramps need to be added here. The Ramps and Morphables should have the same length of tilesets, and those tilesets should be one-to-one correspondence. The old NewUrbanInfo's key `Ramps2` and `Morphable2` had been abandoned, so you need to add them manually.
        ```ini
        [NewUrbanInfo]
        Morphables=114,123
        Ramps=117,193 
        ```
    - `[ExtraMixes]`
        - `Filename = ReadFromMapEditorPathInsteadOfGamePath`
        ```ini
        [ExtraConfigs]
        buxu\123.mix=Yes
        money.txt=No
        
        ; This means FA2 takes {FA2PATH\buxu\123.mix} into consider, and if not found the file,
        ; it will search the file in {GAMEPATH\money.txt}, if this one still doesn't have the file,
        ; FA2 will try to find the file as it used to be.
        ```
    - `[OverlayDisplayLimit]`
        - `OverlayIndex = DisplayLimit` *DisplayLimit should be less than or equals to $60$*
        ```ini
        [OverlayDisplayLimit]
        243=48
        ; This means FA2 won't display overlay 243's frames after 48
        ```
    - `[Filenames]`
        - `EVA = FILENAME`
        - `EVAYR = FILENAME`
        - `Sound = FILENAME`
        - `SoundYR = FILENAME`
        - `Theme = FILENAME`
        - `ThemeYR = FILENAME`
        - `AI = FILENAME`
        - `AIYR = FILENAME`
        - `RulesYR = FILENAME`
        - `Rules = FILENAME`
        - `ArtYR = FILENAME`
        - `Art = FILENAME`
        - `TemperateYR = FILENAME`
        - `Temperate = FILENAME`
        - `SnowYR = FILENAME`
        - `Snow = FILENAME`
        - `UrbanYR = FILENAME`
        - `Urban = FILENAME`
        - `UrbanNYR = FILENAME`
        - `LunarYR = FILENAME`
        - `DesertYR = FILENAME`
        - `MixExtension = FILENAME SUFFIX`
        ```ini
        EVAYR=evamp.ini
        SoundYR=soundmp.ini
        ThemeYR=thememp.ini
        AIYR=aimp.ini
        RulesYR=rulesmp.ini
        ArtYR=artmp.ini
        TemperateYR=temperatmp.ini
        SnowYR=snowmp.ini
        UrbanYR=urbanmp.ini
        UrbanNYR=urbannmp.ini
        LunarYR=lunarmp.ini
        DesertYR=desertmp.ini
        MixExtension=mp
        ```
    - `[ScriptTypeLists]`
        - Contains a list of param type lists
            - NOTICE THAT KEY BEGINS FROM $1$ AND HAS TO BE **INTEGER** 
        - `X=TypeListName`
    - `[TypeListName]`
        - This name is just an example, it should be registered in the `[ScriptTypeLists]`
    ```ini
    [TypeListName]
    HasExtraParam = BOOLEAN
    ExtraParamType = ExtraParamTypeListName
    BuiltInType = INTEGER
    ScriptActionParam = Read the Description below 
    ; Like 0=Buildings, key must be integer, will be ignored if BuiltInType being set and not -1
    ```
    - [ExtraParamTypeListName]
        - This name is just an example, it needn't to be registered in the `[ScriptTypeLists]`
    ```ini
    [ExtraParamTypeListName]
    BuiltInType = INTEGER
    ScriptActionExtraParam = Read the Description below
    ; Like 0=Nearest, key must be integer, will be ignored if BuiltInType being set and not -1
    ```
    - **`[ScriptParams]`**
        - Contains a list of param types used for scripts
            - NOTICE THAT OUR SCRIPT PARAMS ARE INDEPENDENT

        | ID | Meaning |
        | :-: | :-: |
        | 0 | Nothing |
        | 1 | Target |
        | 2 | Waypoint |
        | 3 | ScriptLine |
        | 4 | SplitGroup |
        | 5 | GlobalVariable |
        | 6 | ScriptTypes |
        | 7 | TeamTypes |
        | 8 | Houses |
        | 9 | Speeches |
        | 10 | Sounds |
        | 11 | Movies |
        | 12 | Themes |
        | 13 | Countries | 
        | 14 | LocalVariables |
        | 15 | Facing |
        | 16 | BuildingTypes | 
        | 17 | Animations |
        | 18 | TalkBubbles |
        | 19 | Status |
        | 20 | Boolean |
        | -X | ScriptTypeList at `[ScriptTypeLists]` X |

        ```ini
        [ScriptParams] ; Our sample list
        0=Nothing,0
        1=Target,1
        2=Waypoint,2
        3=Jump To Line #,3
        4=Split Group,4
        5=Global,5
        6=Script,6
        7=Team,7
        8=House,8
        9=Speech,9
        10=Sound,10
        11=Movie,11
        12=Theme,12
        13=Country,13
        14=Local,14
        15=Facing,15
        16=Building,16
        17=Animation,17
        18=Talk Bubble,18
        19=Enter Status,19
        20=Integer,0
        21=Boolean,20
        ```
    - **`[ScriptsRA2]`**
        - `index = name, param, invisible, has param, description`
        - Contains a list of script types used for scripts
        ```ini
        [ScriptsRA2] ; Sample by Caco
        0=0 - Attack,1,0,1,Attack some general TARGET.
        1=1 - Attack WP,2,0,1,Attack specified WAYPOINT (or THINGS on it).
        2=2 - Go Berserk,0,1,0,Cyborgs go berserk (--Obsolete--)
        3=3 - Move to WP,2,0,1,Move to WAYPOINT.
        4=4 - Move to Cell,20,0,1,Move to specified CELL (formula to result: x+y*128).
        5=5 - Guard in Sec,20,0,1,Do AREA GUARD for SECOND(S) defined by argument.
        6=6 - Jump to Line #,3,0,1,Jump to specified LINE with scripts above done.
        7=7 - Player Win,0,0,0,Force player to WIN.
        8=8 - Unload,4,0,1,Kick ALL passengers. Use argument to set which type(s) should CONTINUE the script.
        9=9 - Deploy,0,0,0,Deploy all deployable units.
        10=10 - Follow friendlies,0,0,0,Follow the NEAREST friendly units.
        11=11 - Do this,19,0,1,Cause the team to DO specified MISSION.
        12=12 - Set Global var,5,0,1,Set a GLOBAL variable (1/On).
        13=13 - Idle,0,0,0,Infantries in this team PLAY IDLE ANIMS.
        14=14 - Load onto Transport,0,0,0,Let all units enter the transportation IF POSSIBLE.
        15=15 - Spy into,0,1,0,(--Obsolete--)
        16=16 - Patrol to WP,2,0,1,Patrol (Attack-Move) to WAYPOINT.
        17=17 - Change Script,6,0,1,Change SCRIPT the taskforce used. 
        18=18 - Change Team,7,0,1,Change TEAM the taskforce belong to. 
        19=19 - Panic,0,0,0,Causes all units in the team to panic. (Usually for civilian use)
        20=20 - Change Owner,13,0,1,Specified COUNTRY will own the whole team.
        21=21 - Scatter,0,0,0,Scatter all units.
        22=22 - Escape to Shroud,0,0,0,Cause all units escape to SHROUD.
        23=23 - Player Lose,0,0,0,Force player to LOSE.
        24=24 - Play EVA Speech,9,0,1,Play specified SPEECH.
        25=25 - Play Sound,10,0,1,Play specified SOUND.
        26=26 - Play Movie,11,0,1,Play specified MOVIE (on radar screen).
        27=27 - Play Theme,12,0,1,Play specified THEME.
        28=28 - Reduce Ore,0,0,0,Reduce the value of ORE AROUND TEAM MEMBERS.
        29=29 - Begin Production,0,0,0,Cause the OWNER OF THIS TEAM produce (as planned).
        30=30 - Sell 'n' Hunt,0,0,0,Cause AI SELL their buildings and HUNT their enemies.
        31=31 - Self Destroy,0,0,0,Destroy the team ITSELF.
        32=32 - Start Storm in Sec,20,0,1,Begin the Lightning Storm after specified SECOND(S).
        33=33 - End Storm,0,0,0,End up the CURRENT Lightning Storm.
        34=34 - Center focus on this team,20,0,1,Center focus on this team with specified MOVE SPEED.
        35=35 - Reshroud Map,0,0,0,Reshroud current map.
        36=36 - Reveal Map,0,0,0,Reveal ALL terrain of current map.
        37=37 - Delete Team,0,0,0,Delete ALL members of this team.
        38=38 - Clear Global Var,5,0,1,Clear specified GLOBAL var (0/Off).
        39=39 - Set Local Var,14,0,1,Set specified LOCAL var (1/On).
        40=40 - Clear Local Var,14,0,1,Clear specified LOCAL var (0/Off).
        41=41 - Unpanic,0,0,0,Calm down all units in this team.
        42=42 - Force Facing,15,0,1,Turn all units in this team to a specified direction.
        43=43 - Wait till full,0,0,0,Wait until all passengers loaded.
        44=44 - Truck unload,0,0,0,UNLOAD the goods as all trucks go empty.
        45=45 - Truck load,0,0,0,LOAD the goods as all trucks go full.
        46=46 - Attack enemy buildings,16,0,1,Attack specified BUILDINGS. (+0: MIN threat +65536: MAX threat +131072: nearest, +262144: furthest).
        47=47 - Move to enemy buildings,16,0,1,Move to specified BUILDINGS. (+0: MIN threat +65536: MAX threat +131072: nearest, +262144: furthest).
        48=48 - Scout,0,0,0,The team would scout the shroud area.
        49=49 - Success,0,0,0,Put up the weight of AI trigger attached.
        50=50 - Flash for frames,20,0,1,Flash this team for a number of FRAMES.
        51=51 - Play Animation,17,0,1,Play specified anim on each unit.
        52=52 - Talk bubble,18,0,1,Show a talk bubble on the FIRST UNIT of this team.
        53=53 - Gather outside enemy,20,0,1,Gather outside the enemy's base. Arguments with positive or negative could affect the global distance since Ares 2.0.
        54=54 - Gather outside team,20,0,1,Gather outside the team's base. Arguments with positive or negative could affect the global distance since Ares 2.0.
        55=55 - Ask for SW,20,0,1,AI would queue a SuperWeapon for this team. Arguments decide which group of SW since Ares 2.0 (SW.Group).
        56=56 - Chronoshift to Building,16,0,1,Chronoshift the team to specified buildings if possible. Need EXTRA orders however.
        57=57 - Chronoshift to Target,1,0,1,Chronoshift the team to specified type if possible. Need EXTRA orders however.
        ;YR Only
        58=58 - Move to friendlies buildings,16,0,1,Move to friendlies BUILDINGS. (+0: MIN threat +65536: MAX threat +131072: nearest, +262144: furthest).
        59=59 - Attack (or Garrison) buildings on WP,2,0,1,Attack the building on specified WP. AI would usually try to GARRISON if possible.
        60=60 - Enter Grinder,0,0,0,Get the team into nearest grinder.
        61=61 - Enter Tank Bunker,0,0,0,Get EACH unit in the team into nearest tank bunker.
        62=62 - Enter Bio Reactor,0,0,0,Get EACH infantry in the team into nearest bio reactor.
        63=63 - Enter Battle Bunker,0,0,0,Get EACH infantry in the team into nearest battle bunker (if possible).
        64=64 - Enter Neutral Buildings,0,0,0,Get EACH infantry in the team into nearest civilian buildings (if possible).
        ;Ares 3.0 Only
        65=65 - Auxiliary Power (Ares 3.0 Only),20,0,1,Permanently changes the power output of the house owning the team.
        66=66 - Kill Drivers (Ares 3.0 Only),0,0,0,Kills ALL drivers of the units in this team.
        67=67 - Take Vehicles (Ares 3.0 Only),0,0,0,All CanDrive or VehicleThief infantry in this team will be assigned the closest vehicle they can drive or hijack.
        68=68 - Convert Type (Ares 3.0 Only),0,0,0,Immediately changes all members of this team into their respective script conversion types (Convert.Script).
        69=69 - Sonar Reveal (Ares 3.0 Only),20,0,1,Disables the ability of all team members to cloak themselves for a number of FRAMES.
        70=70 - Disable Weapons (Ares 3.0 Only),20,0,1,Disables the ability of all team members to fire for a number of FRAMES.
        ```
    - `[VehicleVoxelBarrelsRA2]`
    - `[StructureOverlappingCheckIgnores]`
        - id = BuildingRegName
    ```ini
    [StructureOverlappingCheckIgnorance]
    Index = RegName
    ; Like 0=INORANLAMP, value must be a valid building regname
    ```

    - `[OnlineWebsites]`
    ```ini
    [OnlineWebsites]
    Custom1=My Website Name 1,https://website1.com
    Custom2=My Website Name 2,https://website2.com
    Custom3=My Website Name 3,ahttps://website3.com
    ```
- `FALanguage.ini`
    ```ini
    [CURRENTLANGUAGE-StringsRA2]
    [CURRENTLANGUAGE-Strings]
    [CURRENTLANGUAGE-TranslationsRA2]
    [CURRENTLANGUAGE-Translations]
    ; Those four are all acceptable, just write under one of them is okey
    MV_OverlapStructures = TEXT(%1 for count, %2 for X, %3 for Y)
    MV_LogicMissingParams = TEXT(%1 for section, %2 for key)
    TabPages.TilePlacement = TEXT
    TabPages.TriggerSort = TEXT
    Menu.File = TEXT
    Menu.File.New = TEXT
    Menu.File.Open = TEXT
    Menu.File.Save = TEXT
    Menu.File.SaveAs = TEXT
    Menu.File.CheckMap = TEXT
    Menu.File.RunGame = TEXT
    Menu.File.Quit = TEXT
    Menu.Edit = TEXT
    Menu.Edit.Undo = TEXT
    Menu.Edit.Redo = TEXT
    Menu.Edit.Copy = TEXT
    Menu.Edit.CopyWholeMap = TEXT
    Menu.Edit.Paste = TEXT
    Menu.Edit.PasteCentered = TEXT
    Menu.Edit.Map = TEXT
    Menu.Edit.Basic = TEXT
    Menu.Edit.SpecialFlags = TEXT
    Menu.Edit.Lighting = TEXT
    Menu.Edit.Houses = TEXT
    Menu.Edit.TriggerEditor = TEXT
    Menu.Edit.TagEditor = TEXT
    Menu.Edit.Taskforces = TEXT
    Menu.Edit.Scripts = TEXT
    Menu.Edit.Teams = TEXT
    Menu.Edit.AITriggers = TEXT
    Menu.Edit.AITriggerEnable = TEXT
    Menu.Edit.LocalVariables = TEXT
    Menu.Edit.SingleplayerSettings = TEXT
    Menu.Edit.INIEditor = TEXT
    Menu.Terrain = TEXT
    Menu.Terrain.RaiseGround = TEXT
    Menu.Terrain.LowerGround = TEXT
    Menu.Terrain.FlattenGround = TEXT
    Menu.Terrain.HideTileset = TEXT
    Menu.Terrain.ShowEveryTileset = TEXT
    Menu.Terrain.HideSingleField = TEXT
    Menu.Terrain.ShowAllFields = TEXT
    Menu.Terrain.RaiseSingleTile = TEXT
    Menu.Terrain.LowerSingleTile = TEXT
    Menu.MapTools = TEXT
    Menu.MapTools.ChangeMapHeight = TEXT
    Menu.MapTools.AutoCreateShores = TEXT
    Menu.MapTools.AutoLevelUsingCliffs = TEXT
    Menu.MapTools.PaintCliffFront = TEXT
    Menu.MapTools.PaintCliffBack = TEXT
    Menu.MapTools.SearchWaypoint = TEXT
    Menu.MapTools.NavigateCoordinate = TEXT
    Menu.MapTools.ToolScripts = TEXT
    Menu.Online = TEXT
    Menu.Online.FA2sp = TEXT
    Menu.Online.Phobos = TEXT
    Menu.Online.PPM = TEXT
    Menu.Online.ModEnc = TEXT
    Menu.Options = TEXT
    Menu.Options.Settings = TEXT
    Menu.Options.ShowMinimap = TEXT
    Menu.Options.Easymode = TEXT
    Menu.Options.Sounds = TEXT
    Menu.Options.ShowBuildingOutline = TEXT
    Menu.Options.DisableAutoShore = TEXT
    Menu.Options.DisableAutoLAT = TEXT
    Menu.Options.DisableSlopeCorrection = TEXT
    Menu.Help = TEXT
    Menu.Help.Manual = TEXT
    Menu.Help.Info = TEXT
    Menu.Help.Credits = TEXT
    Menu.Help.TipOfTheDay = TEXT
    Menu.Layers = TEXT
    Menu.Layers.Structures = TEXT
    Menu.Layers.Infantries = TEXT
    Menu.Layers.Units = TEXT
    Menu.Layers.Aircrafts = TEXT
    Menu.Layers.Basenodes = TEXT
    Menu.Layers.Waypoints = TEXT
    Menu.Layers.Celltags = TEXT
    Menu.Layers.MoneyOnMap = TEXT
    Menu.Layers.Overlays = TEXT
    Menu.Layers.Terrains = TEXT
    Menu.Layers.Smudges = TEXT
    Menu.Layers.Tubes = TEXT
    Menu.Layers.Bounds = TEXT
    Menu.Lighting = TEXT
    Menu.Lighting.None = TEXT
    Menu.Lighting.Normal = TEXT
    Menu.Lighting.Lightning = TEXT
    Menu.Lighting.Dominator = TEXT
    Menu.PropertyBrush = TEXT
    Menu.PropertyBrush.AutoAircraft = TEXT
    Menu.PropertyBrush.AutoBuilding = TEXT
    Menu.PropertyBrush.AutoInfantry = TEXT
    Menu.PropertyBrush.AutoVehicle = TEXT
    DialogBar.TileManager = TEXT
    DialogBar.TerrainOrGround = TEXT
    DialogBar.OverlayAndSpecial = TEXT
    AITriggerTitle = TEXT
    AITriggerList = TEXT
    AITriggerName = TEXT
    AITriggerTeam1 = TEXT
    AITriggerHouse = TEXT
    AITriggerTeam2 = TEXT
    AITriggerTechlevel = TEXT
    AITriggerType = TEXT
    AITriggerWeight = TEXT
    AITriggerMinWeight = TEXT
    AITriggerMaxWeight = TEXT
    AITriggerMinDiff = TEXT
    AITriggerSide = TEXT
    AITriggerTechnoType = TEXT
    AITriggerCondition = TEXT
    AITriggerNumber = TEXT
    AITriggerAdditionalDesc = TEXT
    AITriggerData = TEXT
    AITriggerEnabled = TEXT
    AITriggerAdd = TEXT
    AITriggerDel = TEXT
    AITriggerClo = TEXT
    AITriggerBaseDefense = TEXT
    AITriggerSkirmish = TEXT
    AITriggerEasy = TEXT
    AITriggerMedium = TEXT
    AITriggerHard = TEXT
    TaskforceTitle = TEXT
    TaskforceList = TEXT
    TaskforceUnits = TEXT
    TaskforceGroup = TEXT
    TaskforceUnitNumber = TEXT
    TaskforceUnitType = TEXT
    TaskforceSelected = TEXT
    TaskforceName = TEXT
    TaskforceNewTask = TEXT
    TaskforceDelTask = TEXT
    TaskforceCloTask = TEXT
    TaskforceNewUnit = TEXT
    TaskforceDelUnit = TEXT
    TaskforceCloUnit = TEXT
    TeamTypesTitle = TEXT
    TeamTypesNewTeam = TEXT
    TeamTypesDelTeam = TEXT
    TeamTypesCloTeam = TEXT
    TeamTypesMainDesc = TEXT
    TeamTypesCurrentTeamLabel = TEXT
    TeamTypesSelectedTeam = TEXT
    TeamTypesLabelName = TEXT
    TeamTypesLabelHouse = TEXT
    TeamTypesLabelTaskforce = TEXT
    TeamTypesLabelScript = TEXT
    TeamTypesLabelTag = TEXT
    TeamTypesLabelVeteranLevel = TEXT
    TeamTypesLabelPriority = TEXT
    TeamTypesLabelMax = TEXT
    TeamTypesLabelTechlevel = TEXT
    TeamTypesLabelTransportWaypoint = TEXT
    TeamTypesLabelGroup = TEXT
    TeamTypesLabelWaypoint = TEXT
    TeamTypesLabelMindControlDecision = TEXT
    TeamTypesCheckBoxLoadable = TEXT
    TeamTypesCheckBoxFull = TEXT
    TeamTypesCheckBoxAnnoyance = TEXT
    TeamTypesCheckBoxGuardSlower = TEXT
    TeamTypesCheckBoxRecruiter = TEXT
    TeamTypesCheckBoxAutoCreate = TEXT
    TeamTypesCheckBoxPrebuild = TEXT
    TeamTypesCheckBoxReinforce = TEXT
    TeamTypesCheckBoxCargoPlane = TEXT
    TeamTypesCheckBoxWhiner = TEXT
    TeamTypesCheckBoxLooseRecruit = TEXT
    TeamTypesCheckBoxAggressive = TEXT
    TeamTypesCheckBoxSuicide = TEXT
    TeamTypesCheckBoxOnTransOnly = TEXT
    TeamTypesCheckBoxAvoidThreats = TEXT
    TeamTypesCheckBoxIonImmune = TEXT
    TeamTypesCheckBoxTransportsReturnOnUnload = TEXT
    TeamTypesCheckBoxAreTeamMembersRecruitable = TEXT
    TeamTypesCheckBoxIsBaseDefense = TEXT
    TeamTypesCheckBoxOnlyTargetHouseEnemy = TEXT
    TriggerFrameTitle = TEXT
    TriggerFrameSelectedTrigger = TEXT
    TriggerFrameNew = TEXT
    TriggerFrameDel = TEXT
    TriggerFramePlace = TEXT
    TriggerFrameClone = TEXT
    TriggerOptionType = TEXT
    TriggerOptionName = TEXT
    TriggerOptionHouse = TEXT
    TriggerOptionAttached = TEXT
    TriggerOptionDisabled = TEXT
    TriggerOptionDisabledDesc = TEXT
    TriggerOptionEasy = TEXT
    TriggerOptionMedium = TEXT
    TriggerOptionHard = TEXT
    TriggerEventCurrent = TEXT
    TriggerEventNew = TEXT
    TriggerEventDel = TEXT
    TriggerEventClo = TEXT
    TriggerEventOptions = TEXT
    TriggerEventType = TEXT
    TriggerEventParameter = TEXT
    TriggerEventParamValue = TEXT
    TriggerEventDesc = TEXT
    TriggerActionCurrent = TEXT
    TriggerActionNew = TEXT
    TriggerActionDel = TEXT
    TriggerActionClo = TEXT
    TriggerActionOptions = TEXT
    TriggerActionType = TEXT
    TriggerActionParameter = TEXT
    TriggerActionParamValue = TEXT
    TriggerActionDesc = TEXT
    TriggerRepeatType.OneTimeOr= TEXT
    TriggerRepeatType.OneTimeAnd= TEXT
    TriggerRepeatType.RepeatingOr= TEXT
    ScriptTypesTitle = TEXT
    ScriptTypesDesc = TEXT
    ScriptTypesSelectedScript = TEXT
    ScriptTypesName = TEXT
    ScriptTypesActions = TEXT
    ScriptTypesActionType = TEXT
    ScriptTypesActionDesc = TEXT
    ScriptTypesAddScript = TEXT
    ScriptTypesDelScript = TEXT
    ScriptTypesCloScript = TEXT
    ScriptTypesAddAction = TEXT
    ScriptTypesDelAction = TEXT
    ScriptTypesActionParam = TEXT
    ScriptTypesCloAction = TEXT
    ScriptTypesInsertMode = TEXT
    ScriptTypesExtraParam = TEXT
    ScriptTypesMoveUp = TEXT
    ScriptTypesMoveDown = TEXT
    SingleplayerParTimeEasy = TEXT
    SingleplayerParTimeMedium = TEXT
    SingleplayerParTimeHard = TEXT
    SingleplayerOverParTitle = TEXT
    SingleplayerOverParMessage = TEXT
    SingleplayerUnderParTitle = TEXT
    SingleplayerUnderParMessage = TEXT
    LightingTitle = TEXT
    LightingDesc = TEXT
    LightingNormal = TEXT
    LightingIonStorm = TEXT
    LightingDominator = TEXT
    LightingAmbient = TEXT
    LightingGreen = TEXT
    LightingRed = TEXT
    LightingBlue = TEXT
    LightingLevel = TEXT
    LightingGround = TEXT
    LightingNukeAmbientChangeRate = TEXT
    LightingDominatorAmbientChangeRate = TEXT
    PropertyBrushObList = TEXT
    PropertyBrushBuilding = TEXT
    PropertyBrushInfantry = TEXT
    PropertyBrushVehicle = TEXT
    PropertyBrushAircraft = TEXT
    TheaterNameTem = TEXT
    TheaterNameSno = TEXT
    TheaterNameUrb = TEXT
    TheaterNameUbn = TEXT
    TheaterNameLun = TEXT
    TheaterNameDes = TEXT
    AllieEditorTitle = TEXT
    AllieEditorEnemies = TEXT
    AllieEditorAllies = TEXT
    AllieEditorOK = TEXT
    AllieEditorCancel = TEXT
    TileManagerTitle = TEXT
    NavigateCoordTitle = TEXT
    NavigateCoordMessage = TEXT
    NavigateCoordInvalidFormat = TEXT
    NavigateCoordInvalidCoord = TEXT
    NavigateCoordInvalidTitle = TEXT
    FileWatcherMessage = TEXT
    ; Script params
    ; For example, ScriptParam.Status.0
    ScriptParam.Target.[0 - 11] = TEXT
    ScriptParam.SplitGroup.[0 - 3] = TEXT
    ScriptParam.Facing.[0 - 7] = TEXT
    ScriptParam.TalkBubble.[0 - 3] = TEXT
    ScriptParam.Status.[0 - 31] = TEXT 
    ScriptParam.Boolean.[0 - 1] = TEXT
    ScriptExtraParam.Preference.[0 - 3] = TEXT
    ```

## WRITE IN THE END
- This project was developed after FA2Copy with still many bugs to fix, then Zero Fanker advised to use inline hooks instead of Win32API message hooks to implement more functions and fix more bugs, and finally we comes to FA2sp. 

- Thanks to AlexB, who gave me many suggestions and useful infomation while disassembling it. Chatting with him in the midnight because of time difference is quite interesting, too.

- Zero Fanker has made a great contribution to the setting up of this project, with many essential suggestions put forward.

- Caco did quite much test works for this project, also bringing out many problems I haven't noticed before.

- tomsons26 has made great assistance on disassembing it, REALLY HELPFUL.

- thomassneddon provided me with vxl drawing lib and drawing stuff assistence, without I cannot draw the VXL stuffs.

- btw the code of FinalAlert 2 is really in a MESSY! Full of unnecessary constructors. I HATE IT!
