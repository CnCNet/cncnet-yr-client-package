using System.Drawing;
using System.Text.RegularExpressions;
using IniParser;
using IniParser.Model;
using IniParser.Model.Configuration;
using IniParser.Parser;
using PackageBuilder.Classes;
using PackageBuilder.Extensions;
using Serilog;
using Serilog.Core;

namespace PackageBuilder.Builders.MapIni;

public class MapIniBuilder
{
    private static FileIniDataParser _parser;
    private static string _mpMapsBaseIniPath;
    private static string _mpMapsIniPath;
    private static string _mapsPath;
    private static List<Map> _maps;
    private static List<string> _missingMapKeys;
    private static List<string> _addedMapKeys;
    private static Logger _logger;

    private static IniData _mpMapsBaseData;
    private static IniData _mpMapsData;

    private MapIniBuilder()
    {
        
    }

    public static void Build()
    {
        _parser = GetParser();

        InitLogger();
        CheckNecessaryFilesAndDirectories();
        
        _mpMapsBaseData = _parser.ReadFile(_mpMapsBaseIniPath);
        _mpMapsData = _parser.ReadFile(_mpMapsIniPath);

        var mapLoader = new MapLoader(_logger, _mapsPath, _parser, _mpMapsData, GetMapKey);
        _maps = mapLoader.ReadMapFiles();

        WriteMultiMaps();
        CompareMultiMaps();
        WriteMaps();

        // We've gathered all MPMaps.ini data. Now, write it to the file.
        _parser.WriteFile(_mpMapsIniPath, _mpMapsBaseData);

        _logger.Information("Update complete!");
        _logger.Information($"{_missingMapKeys.Count} missing map(s). {Constants.MISSING_MAPS}");
        _logger.Information($"{_addedMapKeys.Count} added map(s). {Constants.ADDED_MAPS}");
        _logger.Information($"{mapLoader.InvalidMaps.Count} invalid map(s). {Constants.INVALID_MAPS}");
    }

    /// <summary>
    /// Writes the MultiMaps section
    /// </summary>
    private static void WriteMultiMaps()
    {
        _mpMapsBaseData.Sections.AddSection(Keys.MultiMaps);
        var multiMapsSection = _mpMapsBaseData[Keys.MultiMaps];
        for (var i = 0; i < _maps.Count; i++)
        {
            var map = _maps[i];
            var mapKey = GetMapKey(map);
            multiMapsSection.SetKeyData(i, mapKey);
        }
    }

    private static void CompareMultiMaps()
    {
        var existingMultiMapValues = _mpMapsData.GetSectionData(Keys.MultiMaps).Keys.Select(key => key.Value).ToList();
        var newMultiMapValues = _mpMapsBaseData.GetSectionData(Keys.MultiMaps).Keys.Select(key => key.Value).ToList();

        _missingMapKeys = existingMultiMapValues.Where(value => !newMultiMapValues.Contains(value)).ToList();
        _addedMapKeys = newMultiMapValues.Where(value => !existingMultiMapValues.Contains(value)).ToList();

        ReportMissingMaps();
        ReportAddedMaps();
    }

    /// <summary>
    /// Reports all maps that are currently missing from original MPMaps.ini
    /// </summary>
    private static void ReportMissingMaps()
    {
        File.Delete(Constants.MISSING_MAPS);
        if (!_missingMapKeys.Any())
            return;
        File.WriteAllLinesAsync(Constants.MISSING_MAPS, _missingMapKeys);
    }

    /// <summary>
    /// Reports all maps that are newly added to MPMaps.ini
    /// </summary>
    private static void ReportAddedMaps()
    {
        File.Delete(Constants.ADDED_MAPS);
        if (!_addedMapKeys.Any())
            return;
        File.WriteAllLinesAsync(Constants.ADDED_MAPS, _addedMapKeys);
    }

    private static void WriteMaps() => _maps.ForEach(WriteMap);

    /// <summary>
    /// Writes a specific section for the specific Map
    /// </summary>
    /// <param name="map">The map to write a section for</param>
    private static void WriteMap(Map map)
    {
        _logger.Information($"Writing map {map.Name}");
        var mapKey = GetMapKey(map);
        var newSection = new SectionData(mapKey);
        var existingSection = _mpMapsData.GetSectionData(mapKey) ?? new SectionData(mapKey);
        // newSection.Merge(existingSection); // for testing only

        // Write the name/description
        newSection.SetKeyValue(Keys.Description, existingSection.GetKeyValue(Keys.Description) ?? map.GetSectionKeyValue(Keys.Basic, Keys.Name));

        // Write the author, prioritizing existing MPMaps.ini, then the Map file, then Unknown
        newSection.SetKeyValue(Keys.Author, existingSection.GetKeyValue(Keys.Author) ?? map.GetSectionKeyValue(Keys.Basic, Keys.Author) ?? Constants.DEFAULT_AUTHOR);

        WriteBriefing(newSection, existingSection, map);
        WriteGameModes(newSection, existingSection, map);
        WriteCoopMissionData(newSection, existingSection, map, out List<string> coopEnemyWaypoints);
        WriteWaypoints(newSection, map, coopEnemyWaypoints, out int waypointIter);

        newSection.SetKeyValue(Keys.MinPlayers, 1);
        newSection.SetKeyValue(Keys.MaxPlayers, waypointIter - coopEnemyWaypoints.Count);
        newSection.SetKeyValue(Keys.EnforceMaxPlayers, Keys.True);

        WriteForceOptions(newSection, map);

        newSection.SetKeyValue(Keys.Size, map.GetSectionKeyValue(Keys.Map, Keys.Size));
        newSection.SetKeyValue(Keys.LocalSize, map.GetSectionKeyValue(Keys.Map, Keys.LocalSize));

        WritePreviewSize(newSection, map);
        WriteTeamStartMappings(newSection, existingSection, map);

        _mpMapsBaseData.SetSectionData(mapKey, newSection);
    }

    /// <summary>
    /// Write forced options.
    /// </summary>
    /// <param name="newSection"></param>
    /// <param name="map"></param>
    private static void WriteForceOptions(SectionData newSection, Map map)
    {
        var mapKey = GetMapKey(map);
        var forcedOptions = map.GetKeyValue(Keys.ForcedOptions);
        if (string.IsNullOrEmpty(forcedOptions))
            return;

        var forcedOptionsName = $"{Keys.ForcedOptions}{mapKey}";
        newSection.SetKeyValue(Keys.ForcedOptions, forcedOptionsName);
        _mpMapsBaseData.SetKeyValue(forcedOptionsName, forcedOptions);
    }

    /// <summary>
    /// Writes Coop mission data
    /// </summary>
    /// <param name="newSection">The section for the new MPMaps.ini</param>
    /// <param name="existingSection">The section for the existing MPMaps.ini</param>
    /// <param name="map"></param>
    /// <param name="coopEnemyWaypoints"></param>
    private static void WriteCoopMissionData(SectionData newSection, SectionData existingSection, Map map, out List<string> coopEnemyWaypoints)
    {
        coopEnemyWaypoints = new List<string>();
        var isCoop = map.GetSectionKeyValue(Keys.Basic, Keys.IsCoopMission) ?? existingSection.GetKeyValue(Keys.IsCoopMission);
        if (!string.Equals(isCoop, Keys.CoopYes, StringComparison.InvariantCultureIgnoreCase) && !string.Equals(isCoop, Keys.CoopTrue, StringComparison.InvariantCultureIgnoreCase))
            return;

        newSection.SetKeyValue(Keys.IsCoopMission, Keys.CoopYes);

        // Disallowed player sides
        var disallowedPlayerSides = map.GetSectionKeyValue(Keys.Basic, Keys.DisallowedPlayerSides) ?? existingSection.GetKeyValue(Keys.DisallowedPlayerSides);
        if (!string.IsNullOrEmpty(disallowedPlayerSides))
            newSection.SetKeyValue(Keys.DisallowedPlayerSides, disallowedPlayerSides);

        // Disallowed player colors
        var disallowedPlayerColors = map.GetSectionKeyValue(Keys.Basic, Keys.DisallowedPlayerColors) ?? existingSection.GetKeyValue(Keys.DisallowedPlayerColors);
        if (!string.IsNullOrEmpty(disallowedPlayerColors))
            newSection.SetKeyValue(Keys.DisallowedPlayerColors, disallowedPlayerColors);

        WriteEnemyHouseInfo(newSection, existingSection, map, coopEnemyWaypoints);
    }

    /// <summary>
    /// Write enemy house infos for coop missions
    /// </summary>
    /// <param name="newSection"></param>
    /// <param name="existingSection"></param>
    /// <param name="map"></param>
    /// <param name="coopEnemyWaypoints"></param>
    private static void WriteEnemyHouseInfo(SectionData newSection, SectionData existingSection, Map map, List<string> coopEnemyWaypoints)
    {
        // Enemy house info
        var useMP = false;
        var enemyHouseNumber = 0;
        var mapEnemyHouse = map.GetSectionKeyValue(Keys.Basic, GetEnemyHouseKey(enemyHouseNumber));
        if (string.IsNullOrEmpty(mapEnemyHouse) || !Regex.IsMatch(mapEnemyHouse, Constants.REGEX_ENEMY_HOUSE))
        {
            useMP = true;
            mapEnemyHouse = existingSection.GetKeyValue(GetEnemyHouseKey(enemyHouseNumber));
        }

        if (string.IsNullOrEmpty(mapEnemyHouse) || !Regex.IsMatch(mapEnemyHouse, Constants.REGEX_ENEMY_HOUSE))
        {
            return;
        }


        while (enemyHouseNumber <= Constants.MAX_ENEMY_HOUSE_NUMBER && !string.IsNullOrEmpty(mapEnemyHouse))
        {
            // remove any comments
            var mapEnemyHouseClean = mapEnemyHouse.Split(";")[0];
            coopEnemyWaypoints.Add((mapEnemyHouseClean[^1] - '0').ToString());
            newSection.SetKeyValue(GetEnemyHouseKey(enemyHouseNumber++), mapEnemyHouse);
            mapEnemyHouse = useMP ? existingSection.GetKeyValue(GetEnemyHouseKey(enemyHouseNumber)) : map.GetSectionKeyValue(Keys.Basic, GetEnemyHouseKey(enemyHouseNumber));
        }
    }

    /// <summary>
    ///  Writes preview image size information
    /// </summary>
    /// <param name="newSection"></param>
    /// <param name="map"></param>
    private static void WritePreviewSize(SectionData newSection, Map map)
    {
        try
        {
            var previewImage = Image.FromStream(File.OpenRead($"{map.ParentDirectory}\\{map.Filename}.png"), false, false);
            newSection.SetKeyValue(Keys.PreviewSize, $"{previewImage.Width},{previewImage.Height}");
        }
        catch (Exception e)
        {
            // do nothing
        }
    }

    /// <summary>
    ///  Writes waypoint information
    /// </summary>
    /// <param name="newSection"></param>
    /// <param name="map"></param>
    /// <param name="coopEnemyWaypoints"></param>
    /// <param name="waypointIter"></param>
    private static void WriteWaypoints(SectionData newSection, Map map, List<string> coopEnemyWaypoints, out int waypointIter)
    {
        waypointIter = 0;
        var mapWaypoint = map.GetSectionKeyValue(Keys.Waypoints, waypointIter);
        while (waypointIter <= Constants.MAX_WAYPOINTS && !string.IsNullOrEmpty(mapWaypoint))
        {
            if (!coopEnemyWaypoints.Contains(waypointIter.ToString()))
                newSection.SetKeyValue($"{Keys.Waypoint}{waypointIter}", mapWaypoint);
            mapWaypoint = map.GetSectionKeyValue(Keys.Waypoints, ++waypointIter);
        }
    }

    private static string GetEnemyHouseKey(int index) => $"{Keys.EnemyHouse}{index}";

    private static void WriteBriefing(SectionData newSection, SectionData existingSection, Map map)
    {
        // Write briefing information, prioritizing map file, then existing MPMaps.ini. Only write if it has a value.
        var briefing = map.GetSectionKeyValue(Keys.Basic, Keys.Briefing);
        if (string.IsNullOrEmpty(briefing) || Regex.IsMatch(briefing, Constants.REGEX_BAD_BRIEFING))
            briefing = existingSection.GetKeyValue(Keys.Briefing);

        if (string.IsNullOrEmpty(briefing))
            return;

        newSection.SetKeyValue(Keys.Briefing, briefing);
    }

    private static void WriteTeamStartMappings(SectionData newSection, SectionData existingSection, Map map)
    {
        for (var i = 0;; i++)
        {
            var teamStartMappingPreset =
                map.GetSectionKeyValue(Keys.Basic, string.Format(Keys.TeamStartMapping, i)) ??
                existingSection.GetKeyValue(string.Format(Keys.TeamStartMapping, i));

            if (string.IsNullOrEmpty(teamStartMappingPreset))
                return; // mapping not found

            var teamStartMappingPresetName =
                map.GetSectionKeyValue(Keys.Basic, string.Format(Keys.TeamStartMappingName, i)) ??
                existingSection.GetKeyValue(string.Format(Keys.TeamStartMappingName, i));

            if (string.IsNullOrEmpty(teamStartMappingPresetName))
                continue; // mapping found, but no name specified

            newSection.SetKeyValue(string.Format(Keys.TeamStartMapping, i), teamStartMappingPreset);
            newSection.SetKeyValue(string.Format(Keys.TeamStartMappingName, i), teamStartMappingPresetName);
        }
    }

    /// <summary>
    /// Write game modes, prioritizing existing MPMaps.ini, then Map file, because a lot of maps don't have game modes set correctly
    /// </summary>
    /// <param name="newSection"></param>
    /// <param name="existingSection"></param>
    /// <param name="map"></param>
    private static void WriteGameModes(SectionData newSection, SectionData existingSection, Map map)
    {
        // Get game modes, prioritizing existing MPMaps.ini, then Map file, because a lot of maps don't have game modes set correctly.
        // Split them by comma into a list
        var gameModes = (existingSection.GetKeyValue(Keys.GameModes)?.Split(",") ??
                         map.Data.GetSectionKeyValue(Keys.Basic, Keys.GameMode)?.Split(",") ??
                         new[] { Constants.DEFAULT_GAME_MODE }).ToList();

        // Replace "Standard" with "Battle", if it exists
        var standardIndex = gameModes.FindIndex(gm => string.Equals(gm, Constants.GAME_MODE_STANDARD, StringComparison.InvariantCultureIgnoreCase));
        if (standardIndex >= 0)
            gameModes[standardIndex] = Constants.GAME_MODE_BATTLE;

        // Create a unique list
        gameModes = gameModes
            .Distinct().ToList();

        // Write game modes to section
        newSection.SetKeyValue(Keys.GameModes, string.Join(",", gameModes));
    }

    private static FileIniDataParser GetParser() => new FileIniDataParser(new IniDataParser(new IniParserConfiguration()
    {
        AssigmentSpacer = string.Empty,
        AllowDuplicateKeys = true,
        SkipInvalidLines = true,
        OverrideDuplicateKeys = true
    }));

    private static string GetMapKey(Map map) => $"{Constants.MAPS_DIRECTORY}\\{map.Filename}";

    private static void InitLogger()
    {
        CreateLogsDir();
        var logFilePath = $"{Directory.GetCurrentDirectory()}\\{Constants.LOG_FILE}";
        File.Delete(logFilePath);
        _logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.File(logFilePath)
            .WriteTo.Console()
            .CreateLogger();
    }

    private static void CreateLogsDir()
    {
        try
        {
            Directory.CreateDirectory(Constants.LOG_DIR);
        }
        catch (Exception)
        {
            // do nothing
        }
    }

    private static void CheckNecessaryFilesAndDirectories()
    {
        _mpMapsBaseIniPath = $"{Directory.GetCurrentDirectory()}\\{Constants.MP_MAPS_BASE_INI_FILE}";
        if (!File.Exists(_mpMapsBaseIniPath))
        {
            _logger.Error($"The required file \"{_mpMapsBaseIniPath}\" does not exist.");
            Environment.Exit(1);
        }

        _mapsPath = $"{Directory.GetCurrentDirectory()}\\{Constants.MAPS_DIRECTORY}";
        if (!Directory.Exists(_mapsPath))
        {
            _logger.Error($"The required maps directory \"{_mapsPath}\" does not exist.");
            Environment.Exit(1);
        }

        _mpMapsIniPath = $"{Directory.GetCurrentDirectory()}\\{Constants.MP_MAPS_INI_FILE}";
        if (File.Exists(_mpMapsIniPath) && !PromptContinueWithMpMaps())
            Environment.Exit(0);
    }

    private static bool PromptContinueWithMpMaps()
    {
        // if (_packageBuilderOptions.Silent)
        return true;

        Console.WriteLine($"The file \"{_mpMapsIniPath}\" already exists.\nContinuing will ovewrite it. Would you still like to continue? [y/N]");
        return string.Equals(Console.ReadLine(), "y", StringComparison.InvariantCultureIgnoreCase);
    }
}
