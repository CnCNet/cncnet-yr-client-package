import { TemplateAppModel } from './template-app-model.class';

export class TemplateModel {
    app: TemplateAppModel;
    sourceDir: string;
    outputDir: string;
    setupIconFile: string;
    licenseFile: string;
    outputBaseFilename: string;
    installDeleteFiles: string[];
    excludedInstallerFiles: string;
    netCoreCheckPath: string;
}
