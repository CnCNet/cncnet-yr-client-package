namespace PackageBuilder.Builders.MapIni;

public class Constants
{
    public const string MP_MAPS_BASE_INI_FILE = $"{Classes.Constants.PACKAGE_CONTENTS}/INI/MPMapsBase.ini";
    public const string MP_MAPS_INI_FILE = $"{Classes.Constants.PACKAGE_CONTENTS}/INI/MPMaps.ini";
    public const string MAPS_DIRECTORY = $"{Classes.Constants.PACKAGE_CONTENTS}/Maps/Yuri's Revenge";
    public const string LOG_DIR = "logs";
    public static readonly string LOG_FILE = $"{LOG_DIR}/map_updater.log";
    public static readonly string MISSING_MAPS = $"{LOG_DIR}/missing_maps.log";
    public static readonly string ADDED_MAPS = $"{LOG_DIR}/added_maps.log";
    public static readonly string INVALID_MAPS = $"{LOG_DIR}/invalid_maps.log";
    public const string GAME_MODE_BATTLE = "Battle";
    public const string GAME_MODE_STANDARD = "Standard";
    public const string DEFAULT_GAME_MODE = GAME_MODE_BATTLE;
    public const string DEFAULT_AUTHOR = "Unknown Author";
    public const string REGEX_BAD_BRIEFING = "^Brief:(ALL|TRN)\\d{2}(md)?$";
    public const string REGEX_ENEMY_HOUSE = "^(\\d+,\\d+,\\d+)\\s*;?.*$";

    public const int MAX_ENEMY_HOUSE_NUMBER = 8;
    public const int MAX_WAYPOINTS = 7;
}
