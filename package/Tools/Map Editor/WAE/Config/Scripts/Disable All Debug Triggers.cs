// Script for disabling all debug triggers in WAE.

// Using clauses.
// Unless you know what's in the WAE code-base, you want to always include
// these "standard usings".
using System;
using MapEditorLibrary;
using MapEditorLibrary.Models;
using MapEditorLibrary.CCEngine;
using TSMapEditor.Rendering;
using MapEditorLibrary.GameMath;
using TSMapEditor.UI.Windows;
using Rampastring.XNAUI;
using MapEditorLibrary.Misc;

namespace WAEScript
{
    public class DisableAllDebugTriggersScript
    {
        /// <summary>
        /// Returns the description of this script.
        /// All scripts must contain this function.
        /// </summary>
        public string GetDescription() => Translator.Translate("MapScripts.DisableDebugTriggers.Description", "This script will disable all triggers with 'debug' in their name (case insensitive). Continue?");

        /// <summary>
        /// Returns the message that is presented to the user if running this script succeeded.
        /// All scripts must contain this function.
        /// </summary>
        public string GetSuccessMessage()
        {
            if (error == null)
                return string.Format(Translator.Translate("MapScripts.DisableDebugTriggers.SuccessMessage", 
                    "Successfully disabled all {0} debug triggers."), debugTriggerCount);

            return error;
        }

        private string error;

        private const string debugString = "debug";
        private int debugTriggerCount;

        /// <summary>
        /// The function that actually does the magic.
        /// </summary>
        /// <param name="map">Map argument that allows us to access map data.</param>
        public void Perform(Map map)
        {
            var debugTriggers = map.Triggers.FindAll(trigger => trigger.Name.Contains(debugString, StringComparison.CurrentCultureIgnoreCase));
            if (debugTriggers.Count == 0)
            {
                error = Translator.Translate("MapScripts.DisableDebugTriggers.Errors.NoDebugTriggers", "No debug triggers found!");
                return;
            }

            foreach (var debugTrigger in debugTriggers)
            {
                debugTrigger.Disabled = true;                
            }

            debugTriggerCount = debugTriggers.Count;
        }
    }
}