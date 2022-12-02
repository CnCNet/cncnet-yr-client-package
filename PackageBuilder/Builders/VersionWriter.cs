using System.Diagnostics;
using PackageBuilder.Classes;

namespace PackageBuilder.Builders;

/// <summary>
/// This class is responsible for using the VersionWriter to write the version file with file hashes.
/// </summary>
public class VersionWriter
{
    private const string VersionWriterResourcesExe = $"{Constants.PACKAGE_RESOURCES}/VersionWriter.exe";
    private const string VersionWriterContentsExe = $"{Constants.PACKAGE_CONTENTS}/VersionWriter.exe";
    private const string VersionIniResourcesFile = $"{Constants.PACKAGE_RESOURCES}/versionconfig.ini";
    private const string VersionIniContentsFile = $"{Constants.PACKAGE_CONTENTS}/versionconfig.ini";
    private const string VersionWriterCopiedFiles = $"{Constants.PACKAGE_CONTENTS}/VersionWriter-CopiedFiles";

    private static void WriteVersionToIni(string version)
    {
        if (!File.Exists(VersionIniResourcesFile))
            throw new Exception($"versionconfig.ini file does not exist: {VersionIniResourcesFile}");

        var versionFileLines = File.ReadAllLines(VersionIniResourcesFile);
        versionFileLines[1] = version;
        File.WriteAllLines(VersionIniContentsFile, versionFileLines);
    }

    public static void Write(PackageConfig packageConfig)
    {
        try
        {
            WriteVersionToIni(packageConfig.AppVersion);
            WriteProcess();
        }
        finally
        {
            CleanUp();
        }
    }

    private static void CleanUp()
    {
        if (File.Exists(VersionIniContentsFile))
            File.Delete(VersionIniContentsFile);

        if (File.Exists(VersionWriterContentsExe))
            File.Delete(VersionWriterContentsExe);

        if (Directory.Exists(VersionWriterCopiedFiles))
            Directory.Delete(VersionWriterCopiedFiles, true);
    }

    private static void WriteProcess()
    {
        if (!File.Exists(VersionWriterContentsExe))
            File.Copy(VersionWriterResourcesExe, VersionWriterContentsExe);
        List<string> errors = new();
        ProcessStartInfo processStartInfo = new ProcessStartInfo();
        processStartInfo.Arguments = $"/S";
        processStartInfo.FileName = VersionWriterContentsExe;
        processStartInfo.WindowStyle = ProcessWindowStyle.Hidden;
        processStartInfo.CreateNoWindow = true;
        processStartInfo.RedirectStandardOutput = true;
        processStartInfo.RedirectStandardError = true;
        processStartInfo.UseShellExecute = false;
        processStartInfo.WorkingDirectory = Constants.PACKAGE_CONTENTS;

        Process process = new Process();
        process.StartInfo = processStartInfo;
        process.OutputDataReceived += (sender, args) => Console.WriteLine($"VersionWriter: {args.Data}");
        process.ErrorDataReceived += (sender, args) => errors.Add(args.Data);
        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();
        process.WaitForExit();

        if (process.ExitCode != 0)
            throw new Exception(string.Join("\n", errors));
    }
}
