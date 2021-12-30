using CommandLine;

namespace YRMapUpdater
{
    public class ProgramOptions
    {
        [Option('s', "silent", Default = false, HelpText = "Use this argument to run without prompts")]
        public bool Silent { get; set; }
    }
}
