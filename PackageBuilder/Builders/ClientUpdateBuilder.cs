using DotLiquid;
using PackageBuilder.Classes;

namespace PackageBuilder.Builders;

public class ClientUpdateBuilder
{
    private const string ClientUpdateResources = $"{Constants.PACKAGE_RESOURCES}/ClientUpdate";

    private const string TemplateFile = $"{ClientUpdateResources}/updateexec.liquid";

    private const string PreUpdateExecOutputFile = $"{Constants.PACKAGE_CONTENTS}/preupdateexec";

    private const string UpdateExecOutputFile = $"{Constants.PACKAGE_CONTENTS}/updateexec";

    private ClientUpdateBuilder()
    {
    }

    public static void Build(PackageConfig config)
    {
        BuildUpdateExec(config.PreUpdateExec, PreUpdateExecOutputFile);
        BuildUpdateExec(config.UpdateExec, UpdateExecOutputFile);
    }

    public static void BuildUpdateExec(UpdateExec updateExec, string outputFile)
    {
        var preUpdateExecOutput = RenderTemplate(TemplateFile, new
        {
            DeleteFiles = updateExec.DeleteFiles.Select(f => f.Replace('/', '\\')),
            DeleteFolders = updateExec.DeleteFolders.Select(f => f.Replace('/', '\\'))
        });
        File.WriteAllText(outputFile, preUpdateExecOutput);
    }

    private static string RenderTemplate(string templateFile, object data)
    {
        if (!File.Exists(templateFile))
            throw new Exception($"Updateexec template file does not exist: {templateFile}");

        var templateContents = File.ReadAllText(templateFile);
        var template = Template.Parse(templateContents);
        return template.Render(Hash.FromAnonymousObject(data));
    }
}
