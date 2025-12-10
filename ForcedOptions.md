# Using Forced Options in Maps

This document outlines the forced options for maps used in CnCnet standard gamemode.

### Please Note:

For maps in specific gamemodes shipped with the CnCnet YR Package, the gamemode likely already has predefined forced option values defined within `MPMaps.ini`

Please look at `[razer_survival_options]` within `MPMaps.ini` if you want forced options on a map per map basis in a gamemode that doesn't have forced options for the entire game predefined.



## [ForcedOptions]

### Game Settings
- **Short Game**: Enabled (`chkShortGame=true`)
  - Enables or disables Short Game mode.
- **MCV Redeployment**: Enabled (`chkRedeplMCV=true`)
  - Allows or disallows MCV redeployment.
- **Auto Repair**: Disabled (`chkAutoRepair=false`)
  - Enables or disables automatic unit repairs.
- **Multi Engineer**: Disabled (`chkMultiEng=false`)
  - Enables or disables multiple engineers capturing buildings.
- **Ingame Allying**: Enabled (`chkIngameAllying=true`)
  - Allows or disallows forming alliances during gameplay.
- **Destroyable Bridges**: Disabled (`chkDestrBridges=false`)
  - Enables or disables bridge destruction.
- **Build Off Ally**: Enabled (`chkBuildOffAlly=true`)
  - Allows or disallows building off allied Construction Yards.
- **RA2 Mode**: Disabled (`chkRA2Mode=false`)
  - Enables or disables Red Alert 2 mode.
- **YR Rebalance Patch**: Disabled (`chkBalancePatch=false`)
  - Enables or disables Yuri's Revenge rebalance patch.
- **Blind Start**: Disabled (`chkNoSpawnPreviews=false`)
  - Enables or disables spawn previews.
- **Yuri Faction**: Enabled (`chkNoYuri=false`)
  - Allows or disallows selecting Yuri as a faction.
- **France Faction**: Enabled (`chkNoFrance=false`)
  - Allows or disallows selecting France as a faction.
- **Spies**: Enabled (`chkNoSpy=false`)
  - Allows or disallows building spies.
- **Engi Dog Immune**: Disabled (`chkNoDogEngiEat=false`)
  - Enables or disables dogs eating engineers.
- **Stolen Tech**: Enabled (`chkNoStolenTech=false`)
  - Allows or disallows spies entering Battle Labs to unlock special units (Chrono Commando, Ivan, Psi-Troop).
  - Battle labs are now immune to spys. As a fail safe, unlocked units now have TechLevel=-1 and BuildLimit=0.
- **Crates**: Enabled (`chkCrates=true`)
  - Enables or disables goodie crate logic in the map.
- **Game Speed Slider**: Enabled (`chkDisableGameSpeed=false`)
  - Enables or Disables gamespeed slider from appearing ingame. `chkDisableGameSpeed=true` disables the slider entirely.

### Game Speed
- **Skirmish Game Speed**: 30 FPS (`cmbGameSpeedCapSkirmish=2`)
  - Sets the starting FPS for skirmish games (range: 0-6; 0 = MAX FPS, 1 = 60 FPS, 2 = 30 FPS).
  - **Note**: FPS/Game Speed is changeable in-game; this only sets the starting value.
- **Multiplayer Game Speed**: 30 FPS (`cmbGameSpeedCapMultiplayer=2`)
  - Sets the starting FPS for multiplayer games (range: 0-6; 0 = 60 FPS, 1 = 45 FPS, 2 = 30 FPS).
  - **Note**: FPS/Game Speed is changeable in-game; this only sets the starting value.
  - Recommended for survival or special maps.

### Resources
- **Starting Credits**: 100,000 (`cmbCredits=0`)
  - Sets starting credits (range: 0-10; 0 = 100,000, 1 = 30,000, ..., 8 = 2,500).
- **Starting Units**: 10 (`cmbStartingUnits=0`)
  - Sets starting unit count (range: 0-10; 0 = 10 units, 1 = 9 units, ..., 9 = 1 unit).

### Super Weapons
- **Super Weapons Modifier**: Enabled (`cmbSuperWeaponsModifier=0`)
  - Controls super weapon availability (range: 0-3):
    - 0 = All (all super weapons allowed).
    - 1 = Strategic (Nuke, Weatherstorm, Dominator only).
    - 2 = Tactical (Iron Curtain, Chronosphere, Genetic Mutator only).
    - 3 = None (no super weapons).

### AI Behavior
- **AI Modifier**: Vanilla AI (`cmbAIModifier=0`)
  - Sets AI difficulty behavior (range: 0-2):
    - 0 = Vanilla AI (default behavior).
    - 1 = Brutal AI (more challenging, based on RA2/YR Brutal AI).
    - 2 = Extreme AI (more challenging, based on RAZER changes).

### Crates
- **Crates Modifier**: Disabled (`cmbCratesModifier=0`)
  - Controls crate spawning (range: 0-3):
    - 0 = Minimal (Maximum crates at a time is 1).
    - 1 = Normal (Crates spawn with default settings from `spawner.xdp`,unless map file has specific values set inside).
    - 2 = Increased (Minimum crate spawn of 8 vs 1).
    - 3 = Extreme (Many crates, minimum 40 vs. 1).
  - **Note**: To fully disable crates, ensure `chkCrates=False`