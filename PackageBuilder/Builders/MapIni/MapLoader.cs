using System.Text.RegularExpressions;
using IniParser;
using IniParser.Model;
using Serilog.Core;

namespace PackageBuilder.Builders.MapIni;

public class MapLoader
{
    private const string REGEX_MAP_NAME = "^\\[\\d\\] \\S.+$";

    private Logger _logger;
    private readonly string _mapsPath;
    private readonly FileIniDataParser _parser;
    private readonly IniData _mpMapsData;
    private readonly Func<Map, string> _getMapKey;
    public List<Tuple<string, string>> InvalidMaps { get; set; }

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
        InvalidMaps = new List<Tuple<string, string>>();
        return ReadMapFiles(_mapsPath);
    }

    private List<Map> ReadMapFiles(string directory)
    {
        _logger.Information($"Reading .map files from {directory}...");
        var mapFiles = Directory.GetFiles(directory, "*.map");
        var rawMaps = mapFiles
            .Select(file =>
            {
                try
                {
                    _logger.Information($"Reading map {file}");
                    var nameBegin = _mapsPath.Length + 1;
                    var nameEnd = file.IndexOf(".map", StringComparison.Ordinal) - nameBegin;
                    var filename = file.Substring(nameBegin, nameEnd);
                    if (filename.Contains("cavern"))
                        Console.WriteLine("");
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
                    InvalidMaps.Add(new Tuple<string, string>(file, e.Message));
                    return null;
                }
            })
            .Where(map => map != null)
            .ToList();

        var maps = rawMaps.Where(HasValidName).ToList();
        ReportInvalidMaps();

        var subDirectories = Directory.GetDirectories(directory);
        maps = subDirectories.Aggregate(maps, (current, subDir) => current.Concat(ReadMapFiles(subDir)).ToList());

        return maps.OrderBy(m => m.Name).ToList();
    }

    private bool HasValidName(Map map)
    {
        var name = _mpMapsData.Sections[_getMapKey(map)]?[Keys.Description] ?? map.GetSectionKeyValue(Keys.Basic, Keys.Name);
        if (string.IsNullOrEmpty(name))
        {
            InvalidMaps.Add(new Tuple<string, string>(map.Filename, "map name is empty"));
            return false;
        }

        if (!Regex.IsMatch(name, REGEX_MAP_NAME))
        {
            InvalidMaps.Add(new Tuple<string, string>(map.Filename, $"\"{name}\" does not match regex {REGEX_MAP_NAME}"));
            return false;
        }

        map.Name = name;
        return true;
    }

    /// <summary>
    /// Reports invalid maps during the read. The data reported is in the format:
    /// {mapName}: {errorMessage}
    /// </summary>
    private void ReportInvalidMaps()
    {
        File.Delete(Constants.INVALID_MAPS);
        if (!InvalidMaps.Any())
            return;
        File.WriteAllLinesAsync(Constants.INVALID_MAPS, InvalidMaps.Select(e => $"{e.Item1}: {e.Item2}\n"));
    }
}
