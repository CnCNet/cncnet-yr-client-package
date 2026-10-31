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

A user can use [Ra2CsfToolsGUI](https://github.com/SadPencil/Ra2CsfToolsGUI) to convert between CSF and INI formats. This repo uses [Ra2CsfFileCLI](https://github.com/SadPencil/Ra2CsfFileCLI) to headlessly convert between CSF and INI formats.

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

CI check for these rules is not implemented yet. Reviewers are responsible for checking it.

All CnCNet projects including this one are contributed to on a volunteer effort.

Thanks!
