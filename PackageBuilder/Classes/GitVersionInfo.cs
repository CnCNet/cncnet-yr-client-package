using System.Reflection;

namespace PackageBuilder.Classes;

public class GitVersionInfo
{
    private readonly List<FieldInfo> _getVersionInformationFields;

    public GitVersionInfo(Type gitVersionInformationType)
    {
        _getVersionInformationFields = gitVersionInformationType.GetFields().ToList();
    }

    private string GetValue(string fieldName) => _getVersionInformationFields.First(f => f.Name == fieldName).GetValue(null).ToString();

    public string FullSemVer => GetValue("FullSemVer");

}
