# CSF Converter

CSF string tables are committed to this repository as readable `.csf.ini` files (for
example `stringtableNN.csf.ini`, `ra2.csf.ini`, and `ra2md.csf.ini`). This tool converts
them into the binary `.csf` files that the game reads. The conversion is performed
automatically by the `build-and-deploy` workflow; generated `.csf` files are ignored by
Git and must not be committed. The workflow also removes the source `.csf.ini` files from
the `package/` copy so that only `.csf` files are shipped.

The actual conversion is done by
[`Ra2CsfFileCLI`](https://github.com/SadPencil/Ra2CsfFileCLI). This package only locates
the committed `.csf.ini` files and invokes the CLI for each of them.

## Setup

Install the [.NET 8 runtime](https://dotnet.microsoft.com/download/dotnet/8.0). The CLI
itself is vendored in `Ra2CsfFileCLI/` from the
[v1.0.0 release](https://github.com/SadPencil/Ra2CsfFileCLI/releases/tag/v1.0.0)
(original `Ra2CsfFileCLI.zip` SHA-256:
`e0c945b173272bb2c48ec7dc37a0d62e19182275316aa8aa30f9412ea50e927a`), so no download is
required. Replace the whole directory when upgrading the CLI.

## Usage

From the `tools` directory:

```sh
npm ci
npm run csf-converter
```

By default, the tool recursively scans `game-assets/` and
`package/Resources/Translations/` for files whose names end with `.csf.ini` and writes
the corresponding `.csf` file next to each of them. The `.ini` suffix is removed, so
`stringtable00.csf.ini` becomes `stringtable00.csf`. Other `.ini` files in those
directories are ignored. Existing `.csf` files are overwritten.

Options:

| Option                | Description                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `-t, --toolPath PATH` | Path to `Ra2CsfFileCLI.dll`. Defaults to `tools/csf-converter/Ra2CsfFileCLI/Ra2CsfFileCLI.dll`. |
| `-s, --searchDir DIR` | Directory to scan recursively. May be specified multiple times.                                 |
| `--dotnet PATH`       | The `dotnet` executable to use. Defaults to `dotnet` on `PATH`.                                 |
| `-h, --help`          | Print usage information.                                                                        |

Examples:

```sh
# Use a CLI extracted somewhere else.
npm run csf-converter -- --toolPath /path/to/Ra2CsfFileCLI.dll

# Only convert one translation directory.
npm run csf-converter -- --searchDir ../package/Resources/Translations/zh-Hans
```

## Converting a CSF back to INI

Use the CLI's `--output` option so the result gets the `.csf.ini` suffix:

```sh
dotnet Ra2CsfFileCLI/Ra2CsfFileCLI.dll csf2ini path/to/stringtable01.csf --output path/to/stringtable01.csf.ini
```

Review the resulting `.csf.ini`, commit it, and delete the `.csf` file. Never commit
generated `.csf` files.
