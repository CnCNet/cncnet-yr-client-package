# Custom Crates

Currently, we have pumpkin crates and present/gift crates available. They are contained within each `expandspawn09.mix` file in their respective folders. Simply copy any one of these files to the `package` folder in the root of this repo and commit it.

To turn OFF custom crates, simply use the `expandspawn09.mix` file from the `None` folder. It is simply empty.

## Creating Custom Crates


Custom crates are stored in `expandspawn09.mix`. To customize the crates you'll need the following tools:
- [Open Source SHP Bulder](https://gamebanana.com/tools/3706)
- [XCC Mixer](https://xhp.xwis.net/utilities/XCC_Utilities.exe)

`Open Source SHP Bulder` is an image editing/creation tool that can create `.shp` (shape) files that can be used for crates.
NOTE: crates images have specific color palettes for each type of terrain (desert, snow, etc...). The SHP builder tool has settings for these different terrains. This tool can be cumbersome in that it requires the user to apply a given terrain color palette to their image.

Each crate has 6 different terrain palettes and thus requires 6 different `shp` files, but with terrain "extensions".
For example, "desert" is a terrain palette. When saving an image as a `shp` file for desert, it must contain the `.des` file extension.
There are 6 different terrain palettes in total:
- Desert (.des extension)
- Lunar (.lun extension)
- Snow (.sno extension)
- Temperate (.tem extension)
- Urban (.urb extension)
- New Urban (.ubn extension)

Six `shp` files must be created with the base filename of `crate`, one for each of the extensions above and each having the proper color palette per their terrain type. IE, you should have the following files created:
- `crate.des`
- `crate.lun`
- `crate.sno`
- `crate.tem`
- `crate.urb`
- `crate.ubn`

Once you've created these `shp` files with the appropriate extensions, you need to create a `expandspawn09.mix` file using `XCC Mixer` and add them to it.
