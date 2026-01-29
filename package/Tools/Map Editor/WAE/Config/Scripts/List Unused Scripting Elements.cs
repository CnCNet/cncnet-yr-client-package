// Script for listing unused scripting elements

// Using clauses.
// Unless you know what's in the WAE code-base, you want to always include
// these "standard usings".
using System;
using System.Globalization;
using System.Text;
using TSMapEditor.CCEngine;
using TSMapEditor.Models;
using TSMapEditor.Models.Enums;

namespace WAEScript
{
    public class ListUnusedScriptingElements
    {
        /// <summary>
        /// Returns the description of this script.
        /// All scripts must contain this function.
        /// </summary>
        public string GetDescription() => "This script lists unused scripting elements." + Environment.NewLine + Environment.NewLine +
            "Unintentionally unused scripting elements might point to the map's scripting having a bug." + Environment.NewLine + Environment.NewLine +
            "Do you want to continue?";

        /// <summary>
        /// Returns the message that is presented to the user if running this script succeeded.
        /// All scripts must contain this function.
        /// </summary>
        public string GetSuccessMessage()
        {
            if (sb.Length == 0)
            {
                return "The map has no unused scripting elements.";
            }

            return "The map has the following unused scripting elements: " + Environment.NewLine + Environment.NewLine + sb.ToString();
        }

        private StringBuilder sb;

        private bool TriggerReferencesTeamType(Map map, TeamType teamType, Trigger trigger)
        {
            foreach (var action in trigger.Actions)
            {
                TriggerActionType triggerActionType = map.EditorConfig.TriggerActionTypes[action.ActionIndex];

                for (int i = 0; i < triggerActionType.Parameters.Length; i++)
                {
                    if (triggerActionType.Parameters[i].TriggerParamType == TriggerParamType.TeamType && action.Parameters[i] == teamType.ININame)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool TriggerReferencesLocalVariable(Map map, LocalVariable localVariable, Trigger trigger)
        {
            foreach (var action in trigger.Actions)
            {
                TriggerActionType triggerActionType = map.EditorConfig.TriggerActionTypes[action.ActionIndex];

                for (int i = 0; i < triggerActionType.Parameters.Length; i++)
                {
                    if (triggerActionType.Parameters[i].TriggerParamType == TriggerParamType.LocalVariable &&
                        action.Parameters[i] == localVariable.Index.ToString(CultureInfo.InvariantCulture))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool ScriptReferencesLocalVariable(Map map, LocalVariable localVariable, Script script)
        {
            foreach (var scriptActionEntry in script.Actions)
            {
                ScriptAction scriptAction = map.EditorConfig.ScriptActions[scriptActionEntry.Action];

                if (scriptAction.ParamType == TriggerParamType.LocalVariable)
                {
                    if (scriptActionEntry.Argument == localVariable.Index)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        /// <summary>
        /// The function that actually does the magic.
        /// </summary>
        /// <param name="map">Map argument that allows us to access map data.</param>
        public void Perform(Map map)
        {
            sb = new StringBuilder();

            foreach (var taskforce in map.TaskForces)
            {
                if (!map.TeamTypes.Exists(tt => tt.TaskForce == taskforce))
                    sb.Append($"- TaskForce \"{taskforce.Name}\"" + Environment.NewLine);
            }

            foreach (var script in map.Scripts)
            {
                if (!map.TeamTypes.Exists(tt => tt.Script == script))
                    sb.Append($"- Script \"{script.Name}\"" + Environment.NewLine);
            }

            foreach (var teamtype in map.TeamTypes)
            {
                if (!map.AITriggerTypes.Exists(aitt => aitt.PrimaryTeam == teamtype || aitt.SecondaryTeam == teamtype) &&
                    !map.Triggers.Exists(trigger => TriggerReferencesTeamType(map, teamtype, trigger)))
                {
                    sb.Append($"- TeamType \"{teamtype.Name}\"" + Environment.NewLine);
                }
            }

            foreach (var localVariable in map.LocalVariables)
            {
                if (!map.Triggers.Exists(trigger => TriggerReferencesLocalVariable(map, localVariable, trigger)) &&
                    !map.Scripts.Exists(script => ScriptReferencesLocalVariable(map, localVariable, script)))
                {
                    sb.Append($"- Local variable \"{localVariable.Name}\"" + Environment.NewLine);
                }
            }
        }
    }
}