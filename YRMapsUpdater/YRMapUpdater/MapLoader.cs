using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using IniParser;
using IniParser.Model;
using Serilog.Core;

namespace YRMapUpdater
{
    public class MapLoader
    {
        private const string MISSING_MAPS = "missing_maps.txt";
        private const string INVALID_MAPS = "invalid_maps.txt";
        private const string REGEX_MAP_NAME = "^\\[\\d\\] \\S.+$";

        private Logger _logger;
        private readonly string _mapsPath;
        private readonly FileIniDataParser _parser;
        private readonly IniData _mpMapsData;
        private readonly Func<Map, string> _getMapKey;

        public MapLoader(Logger logger, string mapsPath, FileIniDataParser parser, IniData mpMapsData, Func<Map, string> getMapKey)
        {
            _logger = logger;
            _mapsPath = mapsPath;
            _parser = parser;
            _mpMapsData = mpMapsData;
            _getMapKey = getMapKey;
        }

        public List<Map> ReadMapFiles()
        {
            _logger.Information("Reading .map files...");
            var mapFiles = Directory.GetFiles(_mapsPath, "*.map");
            var invalidMapFileNames = new List<Tuple<string, string>>();
            var rawMaps = mapFiles
                .Select(file =>
                {
                    try
                    {
                        _logger.Information($"Reading map {file}");
                        var nameBegin = _mapsPath.Length + 1;
                        var nameEnd = file.IndexOf(".map", StringComparison.Ordinal) - nameBegin;
                        var filename = file.Substring(nameBegin, nameEnd);
                        return new Map()
                        {
                            Filename = filename,
                            ParentDirectory = Directory.GetParent(file)?.FullName,
                            Data = _parser.ReadFile(file)
                        };
                    }
                    catch (Exception e)
                    {
                        _logger.Error($"Unable to parse map file \"{file}\"");
                        _logger.Error(e.Message);
                        invalidMapFileNames.Add(new Tuple<string, string>(file, e.Message));
                        return null;
                    }
                })
                .Where(map => map != null)
                .ToList();

            var mapsWithNames = rawMaps.Where(HasValidName).ToList();
            var missingMaps = rawMaps.Except(mapsWithNames).ToList();
            ReportMissingMaps(missingMaps);
            ReportInvalidMaps(invalidMapFileNames);

            return mapsWithNames.ToList();
        }

        private bool HasValidName(Map map)
        {
            var name = _mpMapsData.Sections[_getMapKey(map)]?[Keys.Description] ?? map.GetSectionKeyValue(Keys.Basic, Keys.Name);
            if (string.IsNullOrEmpty(name))
                return false;

            if (!Regex.IsMatch(name, REGEX_MAP_NAME))
                return false;

            map.Name = name;
            return true;
        }

        /// <summary>
        /// Reports all maps that are currently missing
        /// </summary>
        /// <param name="maps"></param>
        private static void ReportMissingMaps(List<Map> maps)
        {
            File.Delete(MISSING_MAPS);
            if (!maps.Any())
                return;
            File.WriteAllLinesAsync(MISSING_MAPS, maps.Select(map => map.FullPath));
        }

        /// <summary>
        /// Reports invalid maps during the read. The data reported is in the format:
        /// {mapName}: {errorMessage}
        /// </summary>
        /// <param name="invalidMapErrors"></param>
        private static void ReportInvalidMaps(List<Tuple<string, string>> invalidMapErrors)
        {
            File.Delete(INVALID_MAPS);
            if (!invalidMapErrors.Any())
                return;
            File.WriteAllLinesAsync(INVALID_MAPS, invalidMapErrors.Select(e => $"{e.Item1}: {e.Item2}\n"));
        }
    }
}
