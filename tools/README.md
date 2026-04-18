# Tools

A set of helper scripts for building, preparing, and publishing the `CnCNet Yuri's Revenge` package.

Most utilities are run from the `tools` root via `npm run <script>`.

## Shared Packages

| Package       | Purpose                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `cncnet-core` | Shared classes, constants, and services for release utilities: GitHub API, SSH, IRC, common option values, and repository paths. |

## Utilities

| Script                           | Package                  | Short Description                                                                                                                                                          |
| -------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run map-name-case-fix`      | `map-name-case-fix`      | Fixes the filename casing of map preview `.png` files based on keys from `MPMaps.ini`.                                                                                     |
| `npm run mpmaps-updater`         | `mpmaps-updater`         | Synchronizes `package/INI/MPMaps.ini` with maps from `package/Maps/Yuri's Revenge`, adds new maps, and removes missing ones.                                               |
| `npm run mix-packer`             | `mix-packer`             | Packs `.pack` directories from `game-assets` into `.mix` archives and writes the result into `package/`.                                                                   |
| `npm run version-writer`         | `version-writer`         | A wrapper around `VersionWriter.exe` that writes version data for the contents of `package/`; on Linux it runs `VersionWriter.exe` via mono or `wine` with a local prefix. |
| `npm run build-installer`        | `build-installer`        | Generates an Inno Setup script from a template and builds an installer from the contents of `package/`; on Linux it runs `ISCC.exe` via `wine` with a local prefix.        |
| `npm run release-tag-validator`  | `release-tag-validator`  | Validates that a release tag matches the `yr-x.y` or `yr-x.y.z` format.                                                                                                    |
| `npm run release-asset-uploader` | `release-asset-uploader` | Uploads the specified file as a GitHub release asset for the current tag.                                                                                                  |
| `npm run publish-release`        | `publish-release`        | Publishes the latest version to the server and sends an IRC release notification.                                                                                          |

## Auxiliary Scripts

| Path                                              | Purpose                                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `base-config.ps1`                                 | Shared PowerShell configuration with paths to the repository, `package/`, `Resources/`, and logs. |
| `download-artifacts/download-client.ps1`          | Downloads client artifacts from GitHub Actions and copies resources into `package/Resources`.     |
| `download-artifacts/download-client-launcher.ps1` | Downloads the launcher from a GitHub release and places it into `package/`.                       |

## Notes

- `mix-packer` requires `--inDir` and `--outDir` when run directly. These arguments are already provided in the root script.
- `build-installer`, `mpmaps-updater`, `map-name-case-fix`, and `version-writer` require `--workingDir` when run directly. The root scripts use `../../package`.
- `release-tag-validator`, `release-asset-uploader`, and `publish-release` are intended to run in CI or in an environment with the required GitHub, SSH, and IRC parameters.
