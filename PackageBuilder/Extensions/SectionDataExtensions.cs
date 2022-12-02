using IniParser.Model;

namespace PackageBuilder.Extensions;

public static class SectionDataExtensions
{
    public static void SetKeyValue(this SectionData section, string key, string value) => section.Keys.SetKeyData(key, value);

    public static void SetKeyValue(this SectionData section, string key, int value) => section.Keys.SetKeyData(key, value);

    public static KeyData GetKeyData(this SectionData section, string key) => section.Keys.GetKeyData(key);

    public static string GetKeyValue(this SectionData section, string key) => section.Keys.GetKeyValue(key);
}
