# Version Writer

This script is simply a wrapper for the `VersionWriter.exe` tool.
It can be executed by simply running `version-writer.bat`.

`VersionWriter.exe` is called with these arguments:
- `/S` - silent, no prompts
- `<packagePath>` - this is the location to the `package` directory at the root of this repo

Example:

`VersionWriter.exe /S <packagePath>`

Details on the VersionWriter.exe tool here:
https://github.com/CnCNet/xna-client-versionwriter
