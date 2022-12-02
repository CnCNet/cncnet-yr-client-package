using System.Text.Json.Serialization;
using DotLiquid;

namespace PackageBuilder.Classes;

[LiquidType("DeleteFiles", "DeleteFolders")]
public class UpdateExec
{
    [JsonPropertyName("deleteFiles")]
    public string[] DeleteFiles { get; set; }

    [JsonPropertyName("deleteFolders")]
    public string[] DeleteFolders { get; set; }
}
