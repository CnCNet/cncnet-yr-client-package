import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { parseArgs } from 'util';

const CSF_INI_HEADER = '[SadPencil.Ra2CsfFile.Ini]';
const STRING_TABLE_FILE_PATTERN = /^stringtable\d+\.ini$/i;

const moduleDir = path.dirname(url.fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(moduleDir, '../../..');
const defaultToolPath = path.resolve(moduleDir, '../Ra2CsfFileCLI/Ra2CsfFileCLI.dll');
const defaultSearchDirs = [
    path.join(repositoryRoot, 'game-assets'),
    path.join(repositoryRoot, 'package', 'Resources', 'Translations'),
];

interface IConverterOptions {
    dotnet: string;
    toolPath: string;
    searchDirs: string[];
}

export class CsfConverterService {
    public static run(): void {
        const { values } = parseArgs({
            options: {
                dotnet: {
                    type: 'string',
                    default: 'dotnet',
                },
                toolPath: {
                    type: 'string',
                    short: 't',
                },
                searchDir: {
                    type: 'string',
                    short: 's',
                    multiple: true,
                },
                help: {
                    type: 'boolean',
                    short: 'h',
                    default: false,
                },
            },
        });

        if (values.help) {
            CsfConverterService.printUsage();
            return;
        }

        new CsfConverterService({
            dotnet: values.dotnet,
            toolPath: path.resolve(values.toolPath ?? defaultToolPath),
            searchDirs: (values.searchDir?.length ? values.searchDir : defaultSearchDirs).map((dir) =>
                path.resolve(dir),
            ),
        }).convertAll();
    }

    private static printUsage(): void {
        console.log(`Convert committed stringtable*.ini files into the .csf files expected by the game.

Usage:
  npm run csf-converter -- [options]

Options:
  -h, --help             Show this help text.
  -t, --toolPath <path>  Path to Ra2CsfFileCLI.dll.
                         Defaults to tools/csf-converter/Ra2CsfFileCLI/Ra2CsfFileCLI.dll.
  -s, --searchDir <dir>  Directory to search recursively for stringtable*.ini files.
                         May be specified more than once. Defaults to game-assets/
                         and package/Resources/Translations/.
      --dotnet <path>    The dotnet executable to use. Defaults to "dotnet".

See tools/csf-converter/README.md for setup instructions.`);
    }

    public constructor(private readonly options: IConverterOptions) {}

    private convertAll(): void {
        this.validateSetup();

        const iniFiles = this.options.searchDirs.flatMap((dir) => this.findStringTableIniFiles(dir));

        if (iniFiles.length === 0) {
            console.log('No stringtable*.ini files found. Nothing to convert.');
            return;
        }

        for (const iniFile of iniFiles) {
            this.convertFile(iniFile);
        }

        console.log(`Converted ${iniFiles.length} string table(s) to CSF.`);
    }

    private validateSetup(): void {
        if (!fs.existsSync(this.options.toolPath)) {
            throw new Error(
                `Ra2CsfFileCLI.dll was not found at '${this.options.toolPath}'.\n` +
                    'Restore the vendored tools/csf-converter/Ra2CsfFileCLI directory, or pass --toolPath.',
            );
        }

        for (const searchDir of this.options.searchDirs) {
            if (!fs.existsSync(searchDir) || !fs.statSync(searchDir).isDirectory()) {
                throw new Error(`Search directory '${searchDir}' does not exist.`);
            }
        }
    }

    private findStringTableIniFiles(directory: string): string[] {
        const result: string[] = [];
        const entries = fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

        for (const entry of entries) {
            const entryPath = path.join(directory, entry.name);

            if (entry.isDirectory()) {
                result.push(...this.findStringTableIniFiles(entryPath));
                continue;
            }

            if (entry.isFile() && STRING_TABLE_FILE_PATTERN.test(entry.name)) {
                result.push(entryPath);
            }
        }

        return result;
    }

    private convertFile(iniFile: string): void {
        this.validateIniFile(iniFile);

        console.log(`Converting '${iniFile}'`);

        const result = spawnSync(this.options.dotnet, [this.options.toolPath, 'ini2csf', iniFile, '--force'], {
            stdio: 'inherit',
        });

        if (result.error) {
            throw new Error(`Failed to run '${this.options.dotnet}': ${result.error.message}`);
        }

        if (result.status !== 0) {
            throw new Error(
                `Ra2CsfFileCLI exited with code ${result.status ?? 'unknown'} while converting '${iniFile}'.`,
            );
        }

        const csfFile = path.join(path.dirname(iniFile), `${path.parse(iniFile).name}.csf`);
        if (!fs.existsSync(csfFile)) {
            throw new Error(`Expected '${csfFile}' to be created, but it does not exist.`);
        }
    }

    private validateIniFile(iniFile: string): void {
        const content = fs.readFileSync(iniFile, 'utf8').replace(/^\uFEFF/, '');

        if (!content.startsWith(CSF_INI_HEADER)) {
            throw new Error(
                `'${iniFile}' does not look like a Ra2CsfFile INI (missing '${CSF_INI_HEADER}' header). ` +
                    'Convert the original .csf file with Ra2CsfFileCLI first.',
            );
        }
    }
}
