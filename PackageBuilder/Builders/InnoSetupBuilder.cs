using System.Diagnostics;
using DotLiquid;
using PackageBuilder.Classes;

namespace PackageBuilder.Builders;

public class InnoSetupBuilder
{
    private const string InnoSetupResources = $"{Constants.PACKAGE_RESOURCES}/InnoSetup";

    private const string TemplateFile = $"{InnoSetupResources}/InnoSetupTemplate.liquid";

    /// <summary>
    /// This comes from the Tools.InnoSetup nuget library, proxied through our PackageBuilder.csproj file.
    /// </summary>
    private static readonly string? InnoSetupCompileExe = AppContext.GetData("InnoSetupCompiler")?.ToString();

    private InnoSetupBuilder()
    {
    }

    public static void Build(PackageConfig config)
    {
        var templateOutput = RenderTemplate(TemplateFile, config);
        var renderedTemplateFile = CreateTempTemplateFileName();
        File.WriteAllText(renderedTemplateFile, templateOutput);
        try
        {
            Compile(renderedTemplateFile);
        }
        finally
        {
            File.Delete(renderedTemplateFile);
        }
    }

    private static string CreateTempTemplateFileName()
    {
        var tempDir = Path.Join(Path.GetTempPath(), "cncnet");
        if (!Directory.Exists(tempDir))
            Directory.CreateDirectory(tempDir);

        return Path.Join(tempDir, $"{Guid.NewGuid()}.iss");
    }

    private static string RenderTemplate(string templateFile, PackageConfig config)
    {
        if (!File.Exists(templateFile))
            throw new Exception($"InnoSetup template file does not exist: {templateFile}");

        config.InnoSetupResources = $"{Directory.GetCurrentDirectory()}/{Constants.PACKAGE_RESOURCES}/InnoSetup";
        config.InnoSetupContents = $"{Directory.GetCurrentDirectory()}/{Constants.PACKAGE_CONTENTS}";
        config.InnoSetupOutputDir = Directory.GetCurrentDirectory();

        var templateContents = File.ReadAllText(templateFile);
        var template = Template.Parse(templateContents);
        return template.Render(Hash.FromAnonymousObject(config));
    }

    private static void Compile(string filePath)
    {
        List<string> errors = new();
        ProcessStartInfo processStartInfo = new ProcessStartInfo();
        processStartInfo.Arguments = $"/VERYSILENT \"{filePath}\"";
        processStartInfo.FileName = InnoSetupCompileExe;
        processStartInfo.WindowStyle = ProcessWindowStyle.Hidden;
        processStartInfo.CreateNoWindow = true;
        processStartInfo.RedirectStandardOutput = true;
        processStartInfo.RedirectStandardError = true;
        processStartInfo.UseShellExecute = false;
        processStartInfo.WorkingDirectory = InnoSetupResources;

        Process process = new Process();
        process.StartInfo = processStartInfo;
        process.OutputDataReceived += (_, args) => Console.WriteLine($"InnoSetup: {args.Data}");
        process.ErrorDataReceived += (_, args) =>
        {
            if (args.Data != null)
                errors.Add(args.Data);
        };
        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();
        process.WaitForExit();

        if (process.ExitCode != 0)
            throw new Exception(string.Join("\n", errors));
    }
}
