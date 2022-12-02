using IniParser.Model;
using PackageBuilder.Extensions;

namespace PackageBuilder.Builders.MapIni;

public class Map
{
    public string Name;
    public string Filename;
    public string ParentDirectory;
    public string FullPath => $"{ParentDirectory}\\{Filename}.map";
    public IniData Data;

    public string GetSectionKeyValue(string sectionKey, string valueKey) => Data?.GetSectionKeyValue(sectionKey, valueKey);

    public string GetSectionKeyValue(string sectionKey, int valueKey) => Data?.GetSectionKeyValue(sectionKey, valueKey.ToString());

    public string GetKeyValue(string valueKey) => Data?.GetKey(valueKey);
}
