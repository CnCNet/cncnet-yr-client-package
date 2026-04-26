# Version Writer

This script is simply a wrapper for the `VersionWriter.exe` tool.
It can be executed by simply running `version-writer.bat`.

Runtime behavior:
- On Windows, `VersionWriter.exe` is started directly.
- On Linux, the script first tries `mono`.
- If `mono` is not available, it falls back to `wine` with a local `WINEPREFIX` in `version-writer/.wine`.
- The script requires `--workingDir` and expects `versionconfig.ini` to be present in that directory.

`VersionWriter.exe` is called with these arguments:
- `/S` - silent, no prompts
- `<workingDir>` - this is the directory whose `versionconfig.ini` and relative include paths should be used

Example:

`npm run version-writer -- --workingDir /path/to/package`

Details on the VersionWriter.exe tool here:
https://github.com/CnCNet/xna-client-versionwriter
