using CommandLine;

namespace YRMapUpdater
{
    public class ProgramOptions
    {
        [Option('n', "name", Default = "Maps Updater", HelpText = "The program name")]
        public string Name { get; set; }
        
        [Option('s', "silent", Default = false, HelpText = "Use this argument to run without prompts")]
        public bool Silent { get; set; }
        
        [Option('w', "workingDir", Default = null, HelpText = "Set the working directory. Defaults to exe directory.")]
        public string WorkingDirectory { get; set; }
        
        [Option('l', "logDir", Default = null, HelpText = "Absolute path of the logs directory. Defaults to working directory.")]
        public string LogsDirectory { get; set; }
        
        [Option('m', "mapsDir", Default = null, HelpText = "Relative path of the maps directory based on working directory.", Required = true)]
        public string MapsDirectory { get; set; }
    }
}
