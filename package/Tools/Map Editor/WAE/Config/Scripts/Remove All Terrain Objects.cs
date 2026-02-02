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
	public class RemoveAllTerrainObjectsScript
	{
		/// <summary>
		/// Returns the description of this script.
		/// All scripts must contain this function.
		/// </summary>
		public string GetDescription() => Translator.Translate("MapScripts.RemoveTerrainObjects.Description", "This script remove all terrain objects (trees etc.) from the map. Continue?");

		/// <summary>
		/// Returns the message that is presented to the user if running this script succeeded.
		/// All scripts must contain this function.
		/// </summary>
		public string GetSuccessMessage()
		{
			return Translator.Translate("MapScripts.RemoveTerrainObjects.Description", "Successfully removed all terrain objects from the map.");
		}

		/// <summary>
		/// The function that actually does the magic.
		/// </summary>
		/// <param name="map">Map argument that allows us to access map data.</param>
		public void Perform(Map map)
		{
			// Query all terrain objects on the map and run an action on them.
			map.DoForAllTerrainObjects(terrainObject =>
			{
				// Delete the terrain object from the map.
				map.RemoveTerrainObject(terrainObject);
			});
		}
	}
}