using System.Reflection;
using PackageBuilder.Builders.MapIni;
using PackageBuilder.Classes;

namespace PackageBuilder.Builders;

/// <summary>
/// This is the overall package builder. It calls to other builders to perform specific work.
/// </summary>
public class PackageBuilder
{
    private PackageBuilder()
    {
    }

    public static void Build()
    {
        var config = PackageConfig.Load();
        config.AppVersion = GetGitVersionInfo().FullSemVer;
        VersionWriter.Write(config);
        InnoSetupBuilder.Build(config);
        MapIniBuilder.Build();
        ClientUpdateBuilder.Build(config);
    }

    private static GitVersionInfo GetGitVersionInfo()
    {
        var gitVersionInformationType = Assembly.GetAssembly(typeof(PackageBuilder)).GetType("GitVersionInformation");
        return new GitVersionInfo(gitVersionInformationType);
    }
}
