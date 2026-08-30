Command & Conquer - Red Alert 2 (c): FinalAlert 2: Yuri's Revenge Editor 1.02
-----------------------------------------------------------------------------
 Copyright 2001 Electronic Arts Inc. All rights reserved.
 Westwood Studios [TM] is an Electronic Arts [TM] brand.

 Microsoft, DirectX, and DirectDraw are registered trademarks or trademarks of Microsoft
 Corporation in the USA and/or other countries.

-----------------------------------------------------------------------------
Welcome Back Commander,

Thanks for reviewing our new & improved C&C: Red Alert 2 Yuri's Revenge mission editor.  
Here at Westwood we've been working hard again with the original FinalAlert developer to 
bring you this new version. We hope you find it useful in accomplishing your
map making mission.

This editor is specifically designed for use with Red Alert 2: Yuri's Revenge.  You
must have Yuri's Revenge installed.

VERSION 1.02 FIXES
1.	FA2YR now reads "ecachemdxx.mix" files, as long as RA2 mode is disabled.

VERSION 1.01 FIXES
1.	Bug that caused some buildings to not show up in Windows XP
2.	When deleting trigger actions, the trigger often became corrupted
3.	FA2YR always used the old RA2 strings instead of the new YR strings
4.	You were unable to place trees in the NewUrban theater
5.	User script "Add Reveal Map Debug Trigger" was broken
6.	Bug that caused crashes when quitting FA2YR
7.	Singleplayer Map Tutorial didn´t consider Yuri's Revenge maps


VERSION 1.01 CHANGES
1.	FA2YR now reads "Expandmdxx.mix" files instead of "Expandxx.mix" files,
	as long as RA2 Mode is disabled.
2.	Team Alliance mode is now supported


KEY NEW FEATURES
1.  Negative light posts
2.  Toggle to outline around buildings
3.  Tag editor to allow making triggers without tags
4.  Random tree tool improved (preview and double click for adding/deleting trees)
5.  Smudge support added
6.  Hotkey (CTRL-F) for "framework mode"
7.  All the Yuri's Revenge art assets, etc.
8.  At the bottom of the File menu have a list of the last four files opened
9.  In the Trigger Editor, automatically clears all fields containing non-default
    info when clicking New Trigger, New Event, and New Action buttons
10. Minimize button to the mini map
11. Search waypoint function
12. Allow user selected starting positions and allies
13. Script support for easier map editing (add new functions to FA2:YR!)
14. Generally faster
15. Copy trigger function
16. AI Trigger Editor


KEY FIXES
1.  Object browser sometimes doesn't list units & buildings
2.  Resizing maps sometimes creates problems (crashes, trees doubled etc)


Regards,

President M. Dugan



TECHNICAL SUPPORT DISCLAIMER
----------
In order to ask questions about FinalAlert 2: Yuri's Revenge, please visit www.westwood.com. 
We will review the message board and reply to questions as often as we can. Technical support 
is limited.  FinalAlert 2: Yuri's Revenge is distributed free of charge for the benefit of Red Alert 2 
fans. 


MINIMUM SPECS
----------
FinalAlert 2: Yuri's Revenge:
- Win9x or Win2k
- DirectX 6
- 64 MB physical, 150 MB free space on your page file harddisk
- Red Alert 2 installed
- Direct X 8.0 recomendend

Command & Conquer: Red Alert 2
- see system requirements on box
- You must have the Yuri's Revenge expansion installed.


KNOWN ISSUES/BUGS
----------
- If FinalAlert 2: Yuri's Revenge crashes while loading pictures, switch into another color mode 
  by right clicking on your desktop and selecting properties. Select the correct 
  tab and switch to another color mode. Then try again. If it doesn´t work, try a 
  lower resolution. And if even this doesn´t help, check the end of this file that 
  has additional notes.
  Work Around:  First you should try switching to 16 bit color depth and probably a 
  lower resolution. If this doesn´t work, you should make sure that c:\ (or where you 
  have your swap file) has enough free space (300-400 MB are perfect). If this also 
  doesn´t help, you can try to increase your swap file size manually (but please only do 
  this if you are experienced!)

- In Windows true color 32 bit when the user right clicks Iso View it may be corrupted.
  Try different color settings in Windows if any unexpected video behavior is occurring.

- Problems may occur if you have one or more mods installed. If you experience problems,
  please try first to remove these mods.
  



HOW TO START
----------
After FinalAlert 2: Yuri's Revenge has finished loading, press F1 to show the manual and
some tutorials.



PLEASE!!! Read the manual by pressing F1 in FinalAlert 2: Yuri's Revenge.  You should also 
begin with the tutorials included.



FAQ
----------
Q: How can I create a zoom trigger?
A: If you want to zoom on a particular place, you must first use the 'move camera 
   and scroll to waypoint' action (#48) and then zoom in.  The zoom rate is controlled 
   by an undocumented keyword which must be placed in the [General] section of RULES.INI 
   or your map file: ZoomInFactor=N    } It works to use Edit->Ini to create a [General] 
   section inside the map file and insert the key.

Q: Can I play the maps online? And use the new unit types online?
A: Yes, the synchronization limit is 180 seconds. You can use the unit types online.

Q: How can I keep the map file small so that I´m able to play with 4 players online?
A: One possibility is to "hide" the preview. Just select the appropiate options when you 
   save the map. Since Patch 1.005 will allow longer synch times, this problem should be
   less of an issue..

Q: Ok I´ve made a multiplayer map. How can I play it?
A: In the Yuri's Revenge map settings dialog, choose "multiplayer maps" and click on 
   your's (usually near the bottom). Note that you cannot load the map in the random 
   map editor.

Q: What is that drag & drop feature? How can I copy units/buildings or move them?
A: Instead of deleting a building and placing it somewhere else, you can simply click 
   with the left mouse button on the building and move your mouse while holding down the
   mouse button. You can now see a line that shows where the building/unit will be placed. 
   If you stop holding down the button, the unit/building will be moved there. If you hold 
   down the shift key also, it will be "copied" there. That means you can  create a big 
   army without having to create every unit yourself. Note: if you move/copy a building 
   and it is to big to be placed at the new position, no warning appears! That means you 
   will probably have problems if you don´t make sure that there is enough space!


FEATURE					BUILT-IN
Basic					Yes
Special Flags				Yes
Lighting				Yes
General editor for sections		Yes
Inserting of other INI files		Yes
Version of rules.ini included in EXE	Not included. Uses directly Red Alert 2´s 
					rules.ini 
Graphical editor			Iso-view included (terrain is shown and EDITABLE!)
Inserting Trees				Yes
Inserting Units				Yes
Inserting Buildings			Yes
Inserting Infantry			Yes
Inserting Aircraft			Yes
Inserting waypoints			Yes
Inserting base nodes			Yes
Object settings				Yes
General map settings			Yes
Triggers etc				Yes
Scripts					Yes
AITriggerTypes etc			Yes
Minimap					Yes
Placing cliffs, water, roads, etc.	Yes


Note: We have not listed every missing/built in feature.


***********
DLLS NEEDED
***********

ADVAPI32.DLL
COMCTL32.DLL 
DDRAW.DLL 
GDI32.DLL 
KERNEL32.DLL
MFC42.DLL   
MSVCP60.DLL 
MSVCRT.DLL  
NTDLL.DLL   
SHELL32.DLL  
SHLWAPI.DLL  
USER32.DLL  
VERSION.DLL

Now DLLs, that are loaded delayed:
COMDLG32.DLL
CRYPT32.DLL 
MPR.DLL    
MSOSS.DLL  
MSVCRT20.DLL 
ODBC32.DLL  
OLE32.DLL  
OLEAUT32.DLL 
OLEDLG.DLL  
OLEPRO32.DLL
RPCRT4.DLL
URLMON.DLL  
WININET.DLL  
WINSPOOL.DRV 
WSOCK32.DLL  








