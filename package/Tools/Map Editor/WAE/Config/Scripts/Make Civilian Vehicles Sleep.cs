// Script for changing the mission of all vehicles
// owned by the "Civilians" house to "Sleep".

// Using clauses.
// Unless you know what's in the WAE code-base, you want to always include
// these "standard usings".
using System;
using TSMapEditor;
using TSMapEditor.Models;
using TSMapEditor.CCEngine;
using TSMapEditor.Rendering;
using TSMapEditor.GameMath;
using TSMapEditor.Misc;

namespace WAEScript
{
    public class MakeAllCivilianVehiclesSleepScript
    {
        /// <summary>
        /// Returns the description of this script.
        /// All scripts must contain this function.
        /// </summary>
        public string GetDescription() => Translator.Translate("MapScripts.CivilianVehiclesSleep.Description", "This script will make change the mission of all vehicles belonging to the \"Civilians\" house to \"Sleep\". Continue?");

        /// <summary>
        /// Returns the message that is presented to the user if running this script succeeded.
        /// All scripts must contain this function.
        /// </summary>
        public string GetSuccessMessage()
        {
            return string.Format(Translator.Translate("MapScripts.CivilianVehiclesSleep.SuccessMessage",
               "Successfully changed the mission of {0} vehicles to Sleep."), count);
        }

        int count = 0;

        /// <summary>
        /// The function that actually does the magic.
        /// </summary>
        /// <param name="map">Map argument that allows us to access map data.</param>
        public void Perform(Map map)
        {
            map.DoForAllTechnos(techno =>
            {
                // If this techno is a Unit (aka vehicle) and its owner is called "Civilians",
                // then change its mission to sleep.

                if (techno.WhatAmI() == RTTIType.Unit && techno.Owner.ININame == "Civilians")
                {
                    // The Techno base class has no Mission field, so we need to cast it
                    // as a Unit here. This is safe because we already know that the
                    // techno is a Unit (due to the techno.WhatAmI() == RTTIType.Unit check).

                    var unit = (Unit)techno;
                    unit.Mission = "Sleep";
                    count++;
                }
            });
        }
    }
}