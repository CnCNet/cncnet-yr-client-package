// Script for smoothing water in vanilla Tiberian Sun maps.

// Using clauses.
// Unless you know what's in the WAE code-base, you want to always include
// these "standard usings".
using System;
using TSMapEditor;
using TSMapEditor.Models;
using TSMapEditor.CCEngine;
using TSMapEditor.Rendering;
using TSMapEditor.GameMath;

namespace WAEScript
{
    public class ApplyAnimatedWaterScript
    {
        /// <summary>
        /// Returns the description of this script.
        /// All scripts must contain this function.
        /// </summary>
        public string GetDescription() => "This script will smoothen the water on the map. Continue?";

		/// <summary>
		/// Returns the message that is presented to the user if running this script succeeded.
		/// All scripts must contain this function.
		/// </summary>
		public string GetSuccessMessage()
		{
			if (error == null)
			    return "Water successfully smoothened.";

			return error;
		}

		private string error;

		private TileSet waterTileSet;

		private const string WaterTileSetName = "Water";

		/// <summary>
		/// The function that actually does the magic.
		/// </summary>
		/// <param name="map">Map argument that allows us to access map data.</param>
		public void Perform(Map map)
        {
			waterTileSet = map.TheaterInstance.Theater.FindTileSet(WaterTileSetName);
			if (waterTileSet == null)
			{
				error = "TileSet for water not found!";
				return;
			}

			// The algorithm works as follows:
			// 1. Go through all cells on the map. The following steps are repeated for every cell.
			// 2. Check to make sure that we have not processed this cell yet.
			// 3. Check whether the cell contains water.
			// 4. If the cell contains water, try to fit a 2x2 water cell there.
			//    If it fits, place a random 2x2 water cell on the position.
			//    If it fails to fit, then replace the cell with a 1x1 water cell.
			//    In both cases, mark the cell as processed.

			// Create an array that holds information on
			// which cells we have already processed.
			const int maxCoord = 512; // 512 is the theoretical maximum coord of a cell (in a 256x256 map).
            bool[][] processedCellsMap = new bool[maxCoord][]; 
			for (int i = 0; i < processedCellsMap.Length; i++)
			{
				processedCellsMap[i] = new bool[maxCoord];
			}

            // Specifies the tiles to pick for each round.
            // If multiple tiles are specified for a round, one of them is selected
            // with RNG (there are multiple kinds of 2x2 and 1x1 animated water tiles).
			// All tiles of one group are assumed to be of the same size!
            int[][] tileIndexesToPickFrom = new int[][]
            {
                new int[] { 0, 1, 2, 3, 4, 5 },             // 2x2 water tiles that do not contain rocks
                new int[] { 8, 9, 10, 11, 12 },             // 1x1 water tiles that do not contain rocks
            };

			// Create a random number generator.
            Random random = new Random();

            // Go through all cells on the map.
            // If we find water on a cell, replace it with the 1x1 water tile.
            // This gives us a clean "baseline" to work with.
            map.DoForAllValidTiles(mapCell =>
            {
				// Check whether we have processed this cell before.
				// If yes, skip it.
				if (processedCellsMap[mapCell.Y][mapCell.X])
					return;

                // Check whether this cell contains water
                if (!IsWaterTile(mapCell.TileIndex))
                    return;

				// Go through the tile groups.
                for (int sizeTypeIndex = 0; sizeTypeIndex < tileIndexesToPickFrom.Length; sizeTypeIndex++)
				{
                    int[] potentialTileIndexes = tileIndexesToPickFrom[sizeTypeIndex];

                    // Fetch the first tile from this group so we can fetch its size.
                    ITileImage tileImage = map.TheaterInstance.GetTile(waterTileSet.StartTileIndex + potentialTileIndexes[0]);
                    int tileWidth = tileImage.Width;
                    int tileHeight = tileImage.Height;

                    // We know that we're on a water cell, check if we can fit a tile from the "current group" here
					// without overriding non-water cells or cells that we have already processed.
                    if (!CanFitWaterTileHere(map, mapCell.X, mapCell.Y, tileWidth, tileHeight, processedCellsMap))
                        continue; // If not, try with another group if possible.

					// We can fit the tile here, fetch a random tile from our group and place it here!
					int randomizedArrayIndex = random.Next(potentialTileIndexes.Length);
                    tileImage = map.TheaterInstance.GetTile(waterTileSet.StartTileIndex + potentialTileIndexes[randomizedArrayIndex]);
                    map.PlaceTerrainTileAt(tileImage, mapCell.CoordsToPoint());

					// Mark the affected cell(s) as processed.
					// For 1x1 tiles we'll only mark 1 cell, for 2x2 tiles we'll mark 4 cells.
					for (int cy = 0; cy < tileHeight; cy++)
					{
						for (int cx = 0; cx < tileWidth; cx++)
						{
							processedCellsMap[mapCell.Y + cy][mapCell.X + cx] = true;
						}
					}

					// Continue to another cell.
					break;
                }
            });
		}


		// **********************************************************
		// Scripts can optionally also define helper methods to call.
		// **********************************************************


		/// <summary>
		/// Checks whether a cell contains water.
		/// </summary>
		private bool IsWaterTile(int tileIndex)
		{
			if (tileIndex < waterTileSet.StartTileIndex || tileIndex >= waterTileSet.StartTileIndex + waterTileSet.TilesInSet)
				return false;

            // There are a few specific tiles in the water tile set
			// that we do not want to process and replace with regular water.
			// These tiles contain "details", such as rocks.
			// We handle them as exceptions here.

            // 2x2 water rock tile #1
            if (tileIndex == waterTileSet.StartTileIndex + 6)
				return false;

			// 2x2 water rock tile #2
			if (tileIndex == waterTileSet.StartTileIndex + 7)
				return false;

			// 1x1 water rock tile
			if (tileIndex == waterTileSet.StartTileIndex + 13)
				return false;

			return true;
		}

		/// <summary>
		/// Checks whether an area around a cell contains water so
		/// that a water tile of a given size could fit there.
		/// </summary>
		private bool CanFitWaterTileHere(Map map, int x, int y, int tileWidth, int tileHeight, bool[][] processedCellsMap)
		{
			for (int cy = 0; cy < tileHeight; cy++)
			{
				for (int cx = 0; cx < tileWidth; cx++)
				{
					var mapCell = map.GetTile(x + cx, y + cy);
					if (mapCell == null)
						return false;

					// Do not allow placing over processed cells
					if (processedCellsMap[mapCell.Y][mapCell.X])
						return false;

					if (!IsWaterTile(mapCell.TileIndex))
						return false;
				}
			}

			return true;
		}
	}
}