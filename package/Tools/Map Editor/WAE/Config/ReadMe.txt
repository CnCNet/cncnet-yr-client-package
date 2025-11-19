The World-Altering Editor will read INI configuration files from this directory by default.

If an INI file does not exist in this directory, then it is read from the "Default" sub-directory instead.

Process goes as follows, for example if Events.ini was read:

1) WAE searches for Events.ini in this folder (Config). If found, Events.ini is read from this folder.
2) If Events.ini was not found in step 1), WAE then searches for Events.ini in the Default sub-folder. If found, Events.ini is read from the Default sub-folder.

That means that if you want to modify the configuration of the World-Altering Editor for your mod,
you can override stock configuration files by simply creating new configuration files in this directory.

WAE updates do not include files in this directory, other than this readme, meaning
your modifications are safe from updater overrides as long as you put your modifications inside this folder.


------------------


Note on deriving from stock configurations:
If you wish to only slightly change a stock configuration file instead of rewriting it entirely,
you can derive your mod's configuration file from the stock configuration file using the INI parser's BasedOn= key.

For example, to derive your Events.ini from the Events.ini of the stock configuration, you would create
a new Events.ini to this folder, and inside of it write

[INISystem]
BasedOn=Default/Events.ini

Then the INI parser would read Default/Events.ini and merge it with your Events.ini in this folder, with your Events.ini
taking priority in case the files conflict.


------------------


User Interface (UI) Editing

Most of WAE's user interface layout is defined in INI files. You can modify them like other configuration INI files,
although the path is slightly longer due to UI INI files being in sub directories:

You have to create a "UI" folder inside of this folder, and inside of it the UI INI files that you want to modify.
The base UI layouts can be found from the Default/UI folder.

If you want to modify window layouts (INI files in /Default/UI/Windows), you have to create a "UI" sub-folder
in this folder, and then a "Windows" sub-folder inside the "UI" sub-folder, and place your modified window 
layout INI file there.