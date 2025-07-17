;For maps uploaded to the CnCNet map database, and playable through the CnCNet Client.
;This assusmes you are playing in the **Standard** gamemode.
;Maps played and shipped with CnCNet require MPMaps.ini to be used for forced options, if gamemode does not have specific options.


[ForcedOptions]
;Enables or Disables Short Game. True = Enabled, False = Disabled
chkShortGame=true

;Enables or Disables MCV Redeployment. True = Enabled, False = Disabled
chkRedeplMCV=true

;Enables or Disables Auto Repair. True = Enabled, False = Disabled
chkAutoRepair=false

;Enables or Disables Multi Engineer. True = Enabled, False = Disabled
chkMultiEng=false

;Enables or Disables Ingame Allying. True = Enabled, False = Disabled
chkIngameAllying=true

;Enables or Disables Bridges being destroyed. True = Enabled, False = Disabled
chkDestrBridges=false

;Enables or Disables being able to build off of your allies Construction Yards. True = Enabled, False = Disabled
chkBuildOffAlly=true

;Enables or Disables RA2 Mode. True = Enabled, False = Disabled
chkRA2Mode=false

;Enables or Disables YR Rebalance Patch. True = Enabled, False = Disabled
chkBalancePatch=false

;Enables or Disables Spawn Previews. True = Enabled, False = Disabled
chkNoSpawnPreviews=false

;Enables or Disables Yuri from being selected. True = Enabled, False = Disabled
chkNoYuri=false

;Enables or Disables France from being selected. True = Enabled, False = Disabled
chkNoFrance=false

;Enables or Disables Spys from being buildable. True = Enabled, False = Disabled
chkNoSpy=false

;Enables or Disables Dogs being able to eat Engineers. True = Enabled, False = Disabled
chkNoDogEngiEat=false

;Enables or Disables Spys from going into Battle Labs.
;This also stops the Chrono Commando, Ivan and Psi-Troop from being unlocked. 
;True = Enabled, False = Disabled
chkNoStolenTech=false


;The two options below do two things:
;   Forces game speed FPS in the client for skirmish and/or multiplayer games.
;   **PLEASE NOTE: AS OF CURRENT VERSION OF CnCNet, FPS and/or Game Speed is STILL CHANGEABLE WITHIN GAME.**
;   **THIS ONLY SETS THE STARTING FPS AND/OR GAME SPEED.**
;   **ONLY RECOMMENDED FOR SURVIVAL OR SPECIAL MAPS**
cmbGameSpeedCapSkirmish=2       ; range 0-6  ;0 = MAX fps ;1 = 60fps ;2 = 30fps
cmbGameSpeedCapMultiplayer=2    ; range 0-6  ;0 = 60fps ;1 = 45fps ;2 = 30fps


;Starting credits / money for the map.
;By default, values are this: Items=100000,30000,20000,15000,12500,10000,7500,5000,2500
;Using a 0 based index, cmbCredits=0 is 100000, cmbCredits=1 is 30000, etc.
cmbCredits=0                    ; range 0-10


;Starting units for the map.
;By default, values are this: Items=10,9,8,7,6,5,4,3,2,1
;Using a 0 based index, cmbStartingUnits=0 is 10, cmbStartingUnits=1 is 9, etc.
cmbStartingUnits=0              ; range 0-10 ;0 = 10


;Enables or Disables the use of Super Weapons.
;cmbSuperWeaponsModifier=0 = Enabled
;cmbSuperWeaponsModifier=1 = Offensive
;cmbSuperWeaponsModifier=2 = Defensive
;cmbSuperWeaponsModifier=3 = Disabled
;Enabled = All is allowed and buildable.
;Offensive = Only Offensive superweapons are allowed. Nuke / Weatherstorm / Dominator
;Defensive = Only Defensive superweapons are allowed. Iron Curtain / Chronosphere / Genetic Mutator
;Disabled = All disabled, duh. Yuri is master. ~~
cmbSuperWeaponsModifier=0       ; range 0-3  ;0 = Enabled ;3 = Disabled


;Sets the behavior of the Computer difficulty set.
;These values only change the AI behavior.
;Easy, medium or hard can behave differently based on the cmbAIModifier value.
;Vanilla = Default AI behavior. Nothing is changed.
;Brutal AI = AI will try to be more difficult, based on vanilla RA2/YR Brutal AI.
;Extreme AI = AI will try to be more difficult, based on various changes made by RAZER.
cmbAIModifier=0                 ; range 0-2  ;0 = Vanilla AI, 1= Brutal AI, 2 = Extreme AI


;Enables or Disables the use of Crates.
;Note: Crates=True is forced written to spawn.ini with this dropdown option being added.
;      In order to absolutely disable crates spawning, you must have disabled selected.
;          If crates are somehow still spawning in a new gamemode, you must set the gamemode spawnini options to have Crates=False.
;              -> Look at Blitz and Blitz 2v2 spawn ini settings inside MPBase.ini for reference.

;Also adjusts how many crates are on a map at anygiven time.
;Disabled = No crates will spawn.
;Enabled-Default = Crates will spawn with default settings.
;    This is only the values based on spawner.xdp. Any map specific crate min/max values will not be changed or overridden.
;Enabled-Extra = A bit more crates will spawn than normal. Minimum value changes to 8 vs 1.
;Enabled-Extreme = A lot more crates will spawn than normal. Minimum value changes to 40 vs 1.
cmbCratesModifier=0             ; range 0-3  ;0 = Disabled, 1 = Enabled-Default, 2 = Enabled - Extra, 3 = Enabled - Extreme