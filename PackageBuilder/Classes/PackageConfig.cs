﻿using System.Text.Json;
using System.Text.Json.Serialization;
using DotLiquid;

namespace PackageBuilder.Classes;

/// <summary>
/// This is the configuration used for the package builder process. It can be used by any of the
/// child builders.
/// </summary>
public class PackageConfig
{
    /// <summary>
    /// This the version of the package to be built in the format X.Y.Z.
    /// It is generated by the GitVersion tool.
    /// </summary>
    [JsonIgnore]
    public string AppVersion { get; set; }

    [JsonPropertyName("appName")]
    public string AppName { get; set; }

    [JsonPropertyName("installerFileName")]
    public string InstallerFileName { get; set; }

    [JsonPropertyName("installerOutputDir")]
    public string InstallerOutputDir { get; set; }

    /// <summary>
    /// These are files that MUST exists for the package to be built. If files in this list
    /// do not exist on disk, an exception will be thrown.
    /// </summary>
    [JsonPropertyName("requiredFiles")]
    public IEnumerable<string>? RequiredFiles { get; set; }

    [JsonPropertyName("preUpdateExec")]
    public UpdateExec PreUpdateExec { get; set; }

    [JsonPropertyName("updateExec")]
    public UpdateExec UpdateExec { get; set; }

    [JsonIgnore]
    public string InnoSetupResources { get; set; }

    [JsonIgnore]
    public string InnoSetupContents { get; set; }

    [JsonIgnore]
    public string InnoSetupOutputDir { get; set; }

    [JsonIgnore]
    public IEnumerable<string> InnoSetupDeleteFiles
        => PreUpdateExec.DeleteFiles
            .Concat(PreUpdateExec.DeleteFolders)
            .Concat(UpdateExec.DeleteFiles)
            .Concat(UpdateExec.DeleteFolders);

    public static PackageConfig Load()
    {
        if (!File.Exists(Constants.PACKAGE_BUILDER_CONFIG))
            throw new Exception($"Template config does not exist: {Constants.PACKAGE_BUILDER_CONFIG}");

        var templateConfigContents = File.ReadAllText(Constants.PACKAGE_BUILDER_CONFIG);
        var templateConfig = JsonSerializer.Deserialize<PackageConfig>(templateConfigContents);
        if (templateConfig == null)
            throw new Exception($"Unable to parse template config file content: {templateConfigContents}");

        ValidateRequiredFiles(templateConfig);
        return templateConfig;
    }

    public static void ValidateRequiredFiles(PackageConfig packageConfig)
    {
        foreach (var requiredFile in packageConfig.RequiredFiles ?? new List<string>())
        {
            var _requiredFile = $"{Constants.PACKAGE_CONTENTS}/{requiredFile}";
            if (!File.Exists(_requiredFile))
                throw new Exception($"Missing required file: {_requiredFile}");
        }
    }
}
