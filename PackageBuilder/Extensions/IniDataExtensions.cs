using IniParser.Model;

namespace PackageBuilder.Extensions;

public static class IniDataExtensions
{
    public static void SetSectionData(this IniData ini, string key, SectionData sectionData) => ini.Sections.SetSectionData(key, sectionData);
    public static void SetKeyValue(this IniData ini, string key, string value) => ini.Global.SetKeyData(new KeyData(key)
    {
        Value = value
    });

    public static SectionData GetSectionData(this IniData ini, string key) => ini.Sections.GetSectionData(key);

    public static string GetSectionKeyValue(this IniData ini, string sectionKey, string valueKey) => ini.GetSectionData(sectionKey).GetKeyValue(valueKey);
}
