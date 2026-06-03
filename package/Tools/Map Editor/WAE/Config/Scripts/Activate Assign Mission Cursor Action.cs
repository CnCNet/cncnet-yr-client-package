// Script for activating a mission assignment cursor

// Using clauses.
// Unless you know what's in the WAE code-base, you want to always include
// these "standard usings".
using Microsoft.Xna.Framework;
using Rampastring.Tools;
using Rampastring.XNAUI;
using Rampastring.XNAUI.XNAControls;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using TSMapEditor;
using TSMapEditor.GameMath;
using TSMapEditor.Misc;
using TSMapEditor.Models;
using TSMapEditor.Mutations;
using TSMapEditor.Rendering;
using TSMapEditor.Scripts;
using TSMapEditor.UI;
using TSMapEditor.UI.Controls;
using TSMapEditor.UI.Windows;

namespace WAEScript
{
    /// <summary>
    /// Script for activating a "Assign Mission" cursor action.
    /// Also serves an example for creating custom INItializableWindow interfaces in scripts.
    /// </summary>
    public class ActivateAssignMissionCursorActionScript
    {


        /// <summary>
        /// Our custom window class.
        /// </summary>
        class SelectMissionWindow : INItializableWindow
        {
            public SelectMissionWindow(WindowManager windowManager, ScriptDependencies scriptDependencies) : base(windowManager)
            {
                this.scriptDependencies = scriptDependencies;
            }

            private readonly ScriptDependencies scriptDependencies;

            private XNADropDown ddMission;

            public override void Initialize()
            {
                Name = nameof(SelectMissionWindow);
                string uiConfig =
    @"
[SelectMissionWindow]
$Width=300
$CC0=lblDescription:XNALabel
$CC1=ddMission:XNADropDown
$CC2=btnOK:EditorButton
$Height=getBottom(btnOK) + EMPTY_SPACE_BOTTOM
HasCloseButton=yes

[lblDescription]
$X=EMPTY_SPACE_SIDES
$Y=EMPTY_SPACE_TOP
Text=Select Mission:

[ddMission]
$Y=getBottom(lblDescription) + (VERTICAL_SPACING * 2)
$Width=200
$X=horizontalCenterOnParent()
Option00=Ambush
Option01=Area Guard
Option02=Attack
Option03=Capture
Option04=Construction
Option05=Enter
Option06=Guard
Option07=Harmless
Option08=Harvest
Option09=Hunt
Option10=Missile
Option11=Move
Option12=Open
Option13=Patrol
Option14=QMove
Option15=Repair
Option16=Rescue
Option17=Retreat
Option18=Return
Option19=Sabotage
Option20=Selling
Option21=Sleep
Option22=Sticky
Option23=Stop
Option24=Unload

[btnOK]
$Y=getBottom(ddMission) + (VERTICAL_SPACING * 2)
$Width=100
$X=horizontalCenterOnParent()
Text=OK
";

                // Because as a script we don't rely on external files, we create
                // our UI configuration INI in memory instead
                // of the default behaviour of reading it from a file.
                // base.Initialize will skip seeking ConfigIni from a file
                // if it is already initialized.
                var bytes = Encoding.UTF8.GetBytes(uiConfig);
                using (var stream = new MemoryStream(bytes))
                {
                    ConfigIni = new IniFile(stream, Encoding.UTF8);
                }

                base.Initialize();

                // Need to specify even optional parameters here because at runtime
                // the compiler has no information about them being optional.
                ddMission = FindChild<XNADropDown>(nameof(ddMission), false);
                ddMission.SelectedIndex = ddMission.Items.FindIndex(ddi => ddi.Text == "Guard");
                FindChild<EditorButton>("btnOK", false).LeftClick += BtnOK_LeftClick;
            }

            /// <summary>
            /// Unsubscribe from event handlers to allow the garbage collector to clean up memory when the window is destroyed.
            /// </summary>
            public override void Kill()
            {
                FindChild<EditorButton>("btnOK", false).LeftClick -= BtnOK_LeftClick;
                base.Kill();
            }

            private void BtnOK_LeftClick(object sender, EventArgs e)
            {
                if (ddMission.SelectedItem == null)
                    return;

                scriptDependencies.EditorState.CursorAction = new AssignMissionCursorAction(scriptDependencies.CursorActionTarget, scriptDependencies.EditorState, ddMission.SelectedItem.Text);
                Hide();
            }

            private void BtnDeleteAllTerrainObjects_LeftClick(object sender, EventArgs e)
            {
                var messageBox = EditorMessageBox.Show(WindowManager, "Are you sure?", "This will delete all terrain objects from the map. Do you want to continue?", MessageBoxButtons.YesNo);

                messageBox.YesClickedAction = msgBox =>
                {
                    scriptDependencies.Map.DoForAllTerrainObjects(scriptDependencies.Map.RemoveTerrainObject);
                    scriptDependencies.CursorActionTarget.InvalidateMap();
                };
            }

            /// <summary>
            /// A public method to allow the main script class to open
            /// the window by calling Show, which is a protected method.
            /// Of course, it also allows you to do any required initialization on opening the window.
            /// </summary>
            public void Open()
            {
                Show();
            }
        }

        /// <summary>
        /// Our custom mutation class, allowing undo/redo of mission assignment.
        /// Needs to be a class within a class, as the script runner
        /// only creates an instance of the first top-level class in a script file.
        /// </summary>
        public class AssignMissionMutation : Mutation
        {
            public AssignMissionMutation(IMutationTarget mutationTarget, string missionName, Point2D cellCoords, BrushSize brushSize) : base(mutationTarget)
            {
                this.missionName = missionName;
                this.cellCoords = cellCoords;
                this.brushSize = brushSize;
            }

            private readonly string missionName;
            private readonly Point2D cellCoords;
            private readonly BrushSize brushSize;

            private List<(TechnoBase techno, string originalMission)> technos = new List<(TechnoBase techno, string originalMission)>();
            private int unitCount;

            public override string GetDisplayString()
            {
                return string.Format(Translator.Translate("MapScripts.AssignMission.AssignMissionMutation.DisplayString", "Change Mission to {0} for {1} unit(s)"), missionName, unitCount);
            }

            public override void Perform()
            {
                brushSize.DoForBrushSize(offset =>
                {
                    Point2D cellCoordsWithOffset = cellCoords + offset;

                    if (!Map.IsCoordWithinMap(cellCoordsWithOffset))
                        return;

                    var cell = Map.GetTile(cellCoordsWithOffset);

                    cell.DoForAllVehicles(unit => 
                    {
                        if (unit.Mission != missionName)
                        {
                            technos.Add((unit, unit.Mission));
                            unit.Mission = missionName;
                        }
                    });

                    cell.DoForAllInfantry(infantry => 
                    {
                        if (infantry.Mission != missionName)
                        {
                            technos.Add((infantry, infantry.Mission));
                            infantry.Mission = missionName;
                        }
                    });

                    cell.DoForAllAircraft(aircraft => 
                    {
                        if (aircraft.Mission != missionName)
                        {
                            technos.Add((aircraft, aircraft.Mission));
                            aircraft.Mission = missionName;
                        }
                    });
                });

                unitCount = technos.Count;
            }

            public override void Undo()
            {
                foreach (var technoInfo in technos)
                {
                    switch (technoInfo.techno.WhatAmI())
                    {
                        case RTTIType.Unit:
                            ((Unit)technoInfo.techno).Mission = technoInfo.originalMission;
                            break;
                        case RTTIType.Infantry:
                            ((Infantry)technoInfo.techno).Mission = technoInfo.originalMission;
                            break;
                        case RTTIType.Aircraft:
                            ((Aircraft)technoInfo.techno).Mission = technoInfo.originalMission;
                            break;
                        default:
                            throw new NotImplementedException("AssignMissionMutation: Unknown techno type " + technoInfo.techno.WhatAmI());
                    }
                }

                technos.Clear();
            }
        }

        /// <summary>
        /// Our custom cursor action class activated by this script.
        /// Needs to be a class within a class, as the script runner
        /// only creates an instance of the first top-level class in a script file.
        /// </summary>
        public class AssignMissionCursorAction : CursorAction
        {
            public AssignMissionCursorAction(ICursorActionTarget cursorActionTarget, EditorState editorState, string missionName) : base(cursorActionTarget)
            {
                this.editorState = editorState;
                this.missionName = missionName;
            }

            private readonly EditorState editorState;

            private readonly string missionName;

            public override string GetName() => Translator.Translate("MapScripts.AssignMission.AssignMissionCursorAction.Name", "Apply Mission To Units");

            public override void LeftClick(Point2D cellCoords)
            {
                base.LeftClick(cellCoords);
                LeftDown(cellCoords);
            }

            public override void LeftDown(Point2D cellCoords)
            {
                var tile = Map.GetTile(cellCoords);

                int totalObjectCount = 0;

                editorState.BrushSize.DoForBrushSize(offset =>
                {
                    Point2D cellCoordsWithOffset = cellCoords + offset;

                    if (!Map.IsCoordWithinMap(cellCoordsWithOffset))
                        return;

                    var cell = Map.GetTile(cellCoordsWithOffset);

                    totalObjectCount += cell.Vehicles.Count(vehicle => vehicle.Mission != missionName);
                    totalObjectCount += cell.Infantry.Count(infantry => infantry != null && infantry.Mission != missionName);
                    totalObjectCount += cell.Aircraft.Count(aircraft => aircraft.Mission != missionName);
                });

                if (totalObjectCount > 0)
                {
                    var mutation = new AssignMissionMutation(MutationTarget, missionName, cellCoords, editorState.BrushSize);
                    PerformMutation(mutation);
                }
            }

            /// <summary>
            /// Draws the preview for the cursor action.
            /// </summary>
            public override void DrawPreview(Point2D cellCoords, Point2D cameraTopLeftPoint)
            {
                // Draw rectangle for the brush.

                Func<Point2D, Map, Point2D> func = Is2DMode ? CellMath.CellTopLeftPointFromCellCoords : CellMath.CellTopLeftPointFromCellCoords_3D;

                Point2D bottomCellCoords = new Point2D(cellCoords.X + editorState.BrushSize.Width - 1, cellCoords.Y + editorState.BrushSize.Height - 1);
                Point2D leftCellCoords = new Point2D(cellCoords.X, cellCoords.Y + editorState.BrushSize.Height - 1);
                Point2D rightCellCoords = new Point2D(cellCoords.X + editorState.BrushSize.Width - 1, cellCoords.Y);

                Point2D topPixelPoint = func(cellCoords, CursorActionTarget.Map) - cameraTopLeftPoint + new Point2D(Constants.CellSizeX / 2, 0);
                Point2D bottomPixelPoint = func(bottomCellCoords, CursorActionTarget.Map) - cameraTopLeftPoint + new Point2D(Constants.CellSizeX / 2, Constants.CellSizeY);
                Point2D leftPixelPoint = func(leftCellCoords, CursorActionTarget.Map) - cameraTopLeftPoint + new Point2D(0, Constants.CellSizeY / 2);
                Point2D rightPixelPoint = func(rightCellCoords, CursorActionTarget.Map) - cameraTopLeftPoint + new Point2D(Constants.CellSizeX, Constants.CellSizeY / 2);

                topPixelPoint = topPixelPoint.ScaleBy(CursorActionTarget.Camera.ZoomLevel);
                bottomPixelPoint = bottomPixelPoint.ScaleBy(CursorActionTarget.Camera.ZoomLevel);
                rightPixelPoint = rightPixelPoint.ScaleBy(CursorActionTarget.Camera.ZoomLevel);
                leftPixelPoint = leftPixelPoint.ScaleBy(CursorActionTarget.Camera.ZoomLevel);

                Color lineColor = Color.Orange;
                int thickness = 2;
                Renderer.DrawLine(topPixelPoint.ToXNAVector(), rightPixelPoint.ToXNAVector(), lineColor, thickness);
                Renderer.DrawLine(topPixelPoint.ToXNAVector(), leftPixelPoint.ToXNAVector(), lineColor, thickness);
                Renderer.DrawLine(rightPixelPoint.ToXNAVector(), bottomPixelPoint.ToXNAVector(), lineColor, thickness);
                Renderer.DrawLine(leftPixelPoint.ToXNAVector(), bottomPixelPoint.ToXNAVector(), lineColor, thickness);

                // Draw "Assign Mission" in the center of the area.
                Point2D centerPixelPoint = new Point2D((leftPixelPoint.X + rightPixelPoint.X) / 2, (topPixelPoint.Y + bottomPixelPoint.Y) / 2);

                string text = Translator.Translate("MapScripts.AssignMission.AssignMissionCursorAction.CursorActionText", "Assign Mission");
                var textDimensions = Renderer.GetTextDimensions(text, Constants.UIBoldFont);
                int x = centerPixelPoint.X - (int)(textDimensions.X / 2);
                int y = centerPixelPoint.Y - (int)(textDimensions.Y / 2);

                Renderer.DrawStringWithShadow(text,
                    Constants.UIBoldFont,
                    new Vector2(x, y),
                    lineColor);
            }
        }

        /// <summary>
        /// This needs to be declared as 2 so the script runner knows we support ScriptDependencies.
        /// </summary>
        public int ApiVersion { get; } = 2;

        /// <summary>
        /// Script dependencies object that is assigned by editor when the script is run.
        /// Contains Map, CursorActionTarget (MapView instance), EditorState, WindowManager, and WindowController.
        /// </summary>
        public ScriptDependencies ScriptDependencies { get; set; }

        private SelectMissionWindow selectMissionWindow;

        /// <summary>
        /// Main function for executing the script.
        /// </summary>
        public void Perform()
        {
            selectMissionWindow = new SelectMissionWindow(ScriptDependencies.WindowManager, ScriptDependencies);
            ScriptDependencies.WindowController.AddWindow(selectMissionWindow);
            selectMissionWindow.Closed += SelectMissionWindow_Closed;
            selectMissionWindow.Open();
        }

        private void SelectMissionWindow_Closed(object sender, EventArgs e)
        {
            selectMissionWindow.Closed -= SelectMissionWindow_Closed;
            ScriptDependencies.WindowController.RemoveWindow(selectMissionWindow);
        }
    }
}