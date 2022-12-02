using IniParser.Model;

namespace PackageBuilder.Extensions;

public static class KeyDataCollectionExtensions
{
    public static void SetKeyData(this KeyDataCollection keys, string key, string value) =>
        keys.SetKeyData(new KeyData(key)
        {
            Value = value
        });

    public static void SetKeyData(this KeyDataCollection keys, int key, string value) => keys.SetKeyData(key.ToString(), value);

    public static void SetKeyData(this KeyDataCollection keys, int key, int value) => keys.SetKeyData(key.ToString(), value.ToString());

    public static void SetKeyData(this KeyDataCollection keys, string key, int value) => keys.SetKeyData(key, value.ToString());

    public static KeyData GetKeyData(this KeyDataCollection keys, string key) => keys.GetKeyData(key);

    public static string GetKeyValue(this KeyDataCollection keys, string key) => keys.GetKeyData(key)?.Value;
}
