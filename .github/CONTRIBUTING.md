## How to contribute

#### **Did you find a bug?**

* **Do not open up a GitHub issue if the bug is a security vulnerability**, and instead to refer to our [security policy](https://github.com/CnCNet/cncnet-yr-client-package/blob/develop/SECURITY.md).

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/CnCNet/cncnet-yr-client-package/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/CnCNet/cncnet-yr-client-package/issues/new). Be sure to use our templates to help you submit an issue, please include as much relevant information as possible.

#### **Did you fix a bug?**

* Open a new GitHub pull request linked to the issue (or create an issue first and then link it).

* Ensure the PR description clearly describes the problem and solution and ensure it is linked to an issue.

#### **Did you change a string table (CSF)?**

The game reads string tables in the binary `.csf` format, but this repository stores
them as readable `.ini` files. The `.csf` files are generated from the `.ini` files
during the build and are **not** committed. Edit the `.ini` files instead.

String tables are stored in:

| Path                                                            | Purpose                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------- |
| `game-assets/cncnet.pack/stringtableNN.ini`                     | English string table shipped with the CnCNet package.   |
| `package/Resources/Translations/<language>/stringtableNN.ini`   | Translation of the corresponding English string table.  |

Please follow these rules:

1. `stringtable00` is reserved for Ares and Phobos strings. A translation's
   `stringtable00.ini` may contain **more** labels than the English file because
   Phobos has hard-coded strings that only need translating. Do not remove labels
   that exist only in a translation.
2. For every other string table (`stringtable01` and above), the English file and
   each translation with the same number must contain exactly the same labels. If a
   PR adds, removes, or renames a label in the English file, update every matching
   translation file in the same PR. Add new labels with the English text as a
   placeholder until a translator provides the translation. Missing or outdated labels
   make players see missing text in game.
3. Review the `.ini` diff in your PR. Since the source is text, GitHub displays a
   readable diff and no separate CSF diff needs to be attached.

A CI check for rule 2 is not implemented yet; reviewers are responsible for checking it.

##### Converting between CSF and INI

Use [`Ra2CsfFileCLI`](https://github.com/SadPencil/Ra2CsfFileCLI/releases/tag/v1.0.0)
(requires .NET 8):

```sh
# Convert an existing CSF to the INI source format.
dotnet Ra2CsfFileCLI.dll csf2ini path/to/stringtable01.csf

# Convert the INI source back to the CSF format expected by the game.
dotnet Ra2CsfFileCLI.dll ini2csf path/to/stringtable01.ini --force
```

To regenerate every `stringtable*.csf` from the committed `.ini` files, run (the CLI is
vendored in `tools/csf-converter/`):

```sh
cd tools
npm ci
npm run csf-converter
```

The build workflow performs this conversion automatically. Generated `.csf` files are
ignored by Git; never commit them. See `tools/csf-converter/README.md` for details.

All CnCNet projects including this one are contributed to on a volunteer effort.

Thanks!
