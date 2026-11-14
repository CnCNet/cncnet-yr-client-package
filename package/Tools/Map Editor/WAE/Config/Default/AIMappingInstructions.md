# Mapping Instructions

Mod: Red Alert 2: Yuri's Revenge

## Isometric perspective

The visual perspective of a Tiberian Sun / Red Alert 2 game world is rotated to achieve an isometric perspective. What is a square area in logical map coordinates is actually a diamond for the user. Cells are twice as wide as they are tall, so it is expected that a circular area will look elliptic when looking at it in a screenshot.

## Map Shape and Valid Coordinates

Despite the isometric perspective, a TS/RA2 map appears rectangular in-game. In logical map coordinates, however, its valid cells form a diamond. The isometric perspective rotates this diamond into the rectangle seen by the player.

The map's width and height do not define independent valid ranges for the X and Y coordinates. Do not assume that a 100×100 map uses coordinates from (0, 0) through (99, 99). Some coordinate pairs inside those ranges are invalid, while some valid cells have coordinate values greater than the map's width or height.

Map dimensions can also be misleading when estimating the number of cells. Each unit of map height contains two logical rows to produce the isometric layout: a primary row containing `width` cells and an adjacent row containing `width - 1` cells because of the isometric map border. A map with dimensions `width × height` therefore contains `height × (2 × width - 1)` valid cells. For example, a 100×100 map contains 19,900 cells rather than 10,000.

When placing objects or requesting rectangular map regions, ensure that every required cell lies inside the valid diamond. A region's center can be valid while one or more of its corners are outside the map.

## Height

Objects and terrain on higher ground are visually shifted upwards compared to lower ground. Work-in-progress terrain with inconsistent heights can leave "gaps" into the map that appear as transparent on screen-crops.

## LAT Terrain Placement

LAT is a system that smoothly connects basic ground terrain to other terrain.

Prefer "snake-like" LAT detail placement over large plots of the same LAT. Grass or dirt spots in nature tend to exist in a somewhat "chaotic", imperfect manner, and not as a simple circular or rectangular area.

For an example, let's denote clear space with a dash (-), and a LAT-terrain cell with X, each character representing one cell. For a LAT, the following often looks poor and artificial to the human eye looking at a map:

```
------
-XXXX-
-XXXX-
-XXXX-
-XXXX-
------
```

The following usually looks better and more natural:

```
--XXX-
--X-X-
-XX-X-
--XXX-
-X-X--
--XX--
```

AutoLAT smooths tile transtitions: it DOES NOT make a rectangular large-brush placement organically shaped.

Isolated AutoLAT placements may produce only transition tiles. Connected rows with sufficient thickness are needed to create core LAT.

### AutoLAT Behaviour

Always keep AutoLAT enabled unless you have a good reason not to, like a user request.

AutoLAT preserves neighboring non-clear tilesets such as roads and cliffs. Do not disable AutoLAT merely to protect these tiles.

Disable AutoLAT only when:

- The user explicitly requests manual tile placement.

- Performing a deliberate, localized correction requiring an exact tile index.

Do not use individual raw tiles as decorative accents from a LAT-capable tileset. Paint connected or clustered areas through AutoLAT so their edges transition correctly.

### Natural LAT Masks

For natural terrain such as Grass or Dirt:

- Build a connected mask predominantly 1–3 cells wide.
- Use multiple short strokes, bends, branches, thicker cores, and occasional holes.
- Avoid any single rectangular brush whose width and height are both greater than 3, unless the shape represents something intentionally regular.

Before accepting the result, inspect the mask visually. If its rectangular brush origins are obvious, revise it.

## Detailing Areas

Aside from LATs, try to also use various other pieces when detailing large areas. Rocks, trees, rough ground, debris, villages or cities, small closed lakes... there's usually a lot you can detail a map with. Of course, varying details by area also makes sense depending on user preferences - there could be a lush, thick forest spot in one area, and a desert in another part of the map. The first could feature lots of trees and grass, while the latter would use rocks as detailing. In general, unless requested by the user or fitting the setting, do not leave massive empty areas - even a 10x10 cell area of clear ground usually stands out in a bad way.

Pay special attention to detailing the corner areas of the map "diamond": it's easy to neglect those, but players do pay attention to them.

## Layouting

The Tiberian Sun and Red Alert 2 game engines and gameplay design don't work well with very tight bottlenecks. When designing layouts, ensure that each bottleneck has, at a minimum, a 3-cell row of passable ground at its tightest spot. More is generally preferred, though. Much past 10 cells it starts getting questionable whether something functions as a bottleneck anymore however.

Layouts are often planned with cliffs and shorelines. You can place these by invoking the Connected Tiles tool. Often other kinds of more complicated elements, like thick forests and cities, can also be used as "soft" layout elements because they obstruct movement of large armies.

## Map Validation

`validate_map` is a diagnostic tool, not a map-quality target. Do not resolve under-detailed-area warnings primarily by scattering isolated pebbles, decals, or other passable accents.

Group nearby warnings into larger thematic regions. Resolve them with intentional features such as forests, rocky clearings, burned woodland, farms, ruins, villages, or mixed terrain. Pebbles and similar details should support those features rather than substitute for them.

## Connected Tile Facings

When placing connected tiles, consider their facing. For example, if you are creating a hill surrounded by cliffs, you need to consider whether to place front or back facing cliffs to give the illusion of the cliff being higher than the surrounding terrain. You can always ask the user, or use the MCP server's screen-cropping endpoint for visual verification.

### Closed Shoreline Verification

For lakes and other closed shorelines:

- Draw the shoreline before filling the interior.
- Render a close regional preview.
- Verify that the water-facing artwork points toward the enclosed area.
- If it faces outward, completely clear the failed formation before redrawing it with the opposite side.
- Fill the interior by flood-filling the region enclosed by the finished shore tiles, rather than estimating a smaller geometric mask.

## Placement Order

Prefer to design a layout first, then details. When detailing, place objects like buildings and trees first, then terrain. This is because if you are, for example, creating a city, it is easier to place dirt or pavement LAT under buildings and grass LAT under trees after they have been placed down, than it is to first place dirt/grass and then fit objects on top of them.

## Asymmetry

While an RTS game, original Red Alert 2 maps are sometimes asymmetric. Do not treat symmetry and "perfect balance" as a requirement unless the user mentions wanting a symmetric map. Asymmetric layouts often look more beautiful and can create more varied gameplay situations, which is enjoyable especially to non-competitive players and in mission settings.

## Resource Placement

There are two types of resource fields in Command & Conquer games: regrowing and non-regrowing.

In Red Alert 2, regrowing fields contain an Ore Mine. Around the mine is typically ore and/or gems, though only ore regrows back.

Never place overlay on the same cell where Ore Mines exist.

A good baseline for economy is 3 Ore Mines per player. Tight-money maps have less, while megawealth-style maps can have much more. Some tight-money maps only turn tight in the lategame due to featuring a lot of non-regrowing resources.

For a non-regrowing resource field, simply leave out the Ore Mine. These offer temporary economic boosts, forcing players to relocate and capture more of the map once a non-regrowing field has been harvested dry.

Ore is worth 500 credits for a full harvester load. Gems are 1000, making it twice as valuable.

Prefer resource placement that leads to aggressive gameplay. Players having some safe resources is fine, but the majority of resources should be somehow contestable, either between individual players, or by all players (like resources placed centrally on the map). This forces players to expand and contest each other for resources.

### Resource Field Size

- A small resource field should span approximately 8–10 map cells from edge to edge.

- A large resource field should span approximately 14–16 cells.

- If a placement tool accepts a radius, use roughly radius 4 for a small field and radius 7–8 for a large field. Remember that radius 2 produces only a 5-cell-diameter field.

- Measure the occupied resource footprint—not the surrounding empty area.

Non-regrowing fields must be evaluated by their total initial resource value because they cannot replenish. A central contestable field should offer a meaningful reward relative to the risk of securing it. Higher-value resources such as blue Tiberium may use a somewhat smaller footprint, but not so small that the total harvestable value becomes strategically insignificant.

## Player Starting Waypoints

When making multiplayer maps, waypoints 0 to 7 denote player starting locations. If the map has less than 8 players, waypoints are simply left out: a 4-player map has waypoints 0, 1, 2 and 3.

Additional waypoints, with IDs greater than 7, can be used for various map triggers, like scripted unit spawns or ambient sounds.

In singleplayer missions, no waypoints have special meaning, aside from 99 which is typically the "home cell". Do not use waypoint 100 for anything.

## Invidual Detailing Element Tips

### Lakes

Lakes are created by making an enclosed shoreline with the Connected Tile Tool and filling its interior area with water tiles.

### Villages

Villages are made by placing a cluster of village type buildings near each other, each a few cells apart. Dirt roads or paved roads can be placed around the village to form coherent paths, often with houses placed on both sides of the road. You might sometimes want to place the road first. Road pieces can be placed manually or with the Connected Tiles tool, though the tool often isn't very good at short distances.

Under village buildings and around them should be Dirt LAT, in an irregular pattern. For example, an identical 2x2 dirt patch under each building looks bad - make sure to vary it.

Around village buildings and on yards can be trees, pebbles, and/or rocks, depending on the biome you are aiming to create. If you place trees, you might consider placing a greener LAT like Tall Grass around the trees.

### Cities

Cities are a lot like villages, but use city buildings instead of village buildings, and the buildings are a bit larger. Make sure to use paved roads. Under buildings, you can use either Dirt LAT or Pavement LAT, depending on exactly how urbanized the area should look.

### Forests

Forests use a mix of trees. Around the trees, there should be Grass LAT or a similar LAT type.

A small forest cluster should usually receive a connected 20–40-cell mask, 1–3 cells wide, with branches and at least one thicker core. These numbers can be doubled or tripled for medium-sized forests and multiplied by 10 for large forests.

A recommended approach for placing LAT in forests is connecting tree anchors with an irregular walk, then adding occasional side branches and holes.

### Base Areas

Player starting locations cannot be very heavy on impassable details. Tiles of the "Rough ground" TileSet are suitable for detailing starting locations, as are roads and other details.

## Avoid overlap

The Connected Tiles tool does not prevent you from overlapping tiles, and will happily rewrite previously placed tiles. Make sure you don't overlap tiles accidentally - verify the results especially if you use the Connected Tiles tool multiple times in the same area of the map.

Never place trees, overlays, or anything else on Rock-type cells. Those cells are impassable to everything and placing objects on top of them can cause issues in-game.
