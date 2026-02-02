// Script for setting the difficulty settings of the map (for missions against the AI)

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
using TSMapEditor.Initialization;
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
    /// Script for setting the map's difficulty settings.
    /// Currently only support getting and setting the map's Team Delays.
    /// </summary>
    public class SetMapDifficultySettingsScript
    {
        /// <summary>
        /// Our custom window class.
        /// </summary>
        class SetMapDifficultySettingsWindow : INItializableWindow
        {
            public SetMapDifficultySettingsWindow(WindowManager windowManager, ScriptDependencies scriptDependencies) : base(windowManager)
            {
                this.scriptDependencies = scriptDependencies;                
            }

            private readonly ScriptDependencies scriptDependencies;

            private XNACheckBox chkOverrideTeamDelays;
            private XNALabel lblTeamDelayHard;
            private XNALabel lblTeamDelayMedium;
            private XNALabel lblTeamDelayEasy;
            private EditorNumberTextBox tbTeamDelayHard;
            private EditorNumberTextBox tbTeamDelayMedium;
            private EditorNumberTextBox tbTeamDelayEasy;
            private EditorButton btnApply;

            private List<XNAControl> teamDelayControls = new List<XNAControl>();

            private readonly string sectionName = "General";
            private readonly string keyName = "TeamDelays";

            public override void Initialize()
            {
                Name = nameof(SetMapDifficultySettingsWindow);
                string uiConfig =
    @"
[SetMapDifficultySettingsWindow]
$CC0=lblHeader:XNALabel
$CC01=lblDescription:XNALabel
$Width=400
$Height=180
$CC02=chkOverrideTeamDelays:XNACheckBox
$CC03=lblTeamDelayHard:XNALabel
$CC04=tbTeamDelayHard:EditorNumberTextBox
$CC05=lblTeamDelayMedium:XNALabel
$CC06=tbTeamDelayMedium:EditorNumberTextBox
$CC07=lblTeamDelayEasy:XNALabel
$CC08=tbTeamDelayEasy:EditorNumberTextBox
$CC09=btnApply:EditorButton
HasCloseButton=yes

[lblHeader]
$X=EMPTY_SPACE_SIDES
$Y=EMPTY_SPACE_TOP
$Text=translate(Difficulty Settings)
FontIndex=1

[lblDescription]
$X=getX(lblHeader)
$Y=getBottom(lblHeader) + (VERTICAL_SPACING * 2)
$Text=translate(Manage difficulty settings for the map.)

[chkOverrideTeamDelays]
$X=getX(lblHeader)
$Y=getBottom(lblDescription) + (VERTICAL_SPACING * 3)
$Text=translate(Override Team Delays)

[lblTeamDelayHard]
$X=getX(lblHeader) + 20
$Y=getBottom(chkOverrideTeamDelays) + (VERTICAL_SPACING * 2)
$Text=translate(Hard:)

[tbTeamDelayHard]
$X=getRight(lblTeamDelayHard) + HORIZONTAL_SPACING
$Y=getY(lblTeamDelayHard)
Width=50

[lblTeamDelayMedium]
$X=getRight(tbTeamDelayHard) + 15
$Y=getY(lblTeamDelayHard)
$Text=translate(Medium:)

[tbTeamDelayMedium]
$X=getRight(lblTeamDelayMedium) + HORIZONTAL_SPACING
$Y=getY(lblTeamDelayHard)
Width=50

[lblTeamDelayEasy]
$X=getRight(tbTeamDelayMedium) + 15
$Y=getY(lblTeamDelayHard)
$Text=translate(Easy:)

[tbTeamDelayEasy]
$X=getRight(lblTeamDelayEasy) + HORIZONTAL_SPACING
$Y=getY(lblTeamDelayHard)
Width=50

[btnApply]
$Width=100
$X=horizontalCenterOnParent()
$Y=getHeight(SetMapDifficultySettingsWindow) - getHeight(btnApply) - (VERTICAL_SPACING * 2)
$Text=translate(Apply)
";
                
                var bytes = Encoding.UTF8.GetBytes(uiConfig);
                using (var stream = new MemoryStream(bytes))
                {
                    ConfigIni = new IniFile(stream, Encoding.UTF8);
                }

                base.Initialize();

                chkOverrideTeamDelays = FindChild<XNACheckBox>(nameof(chkOverrideTeamDelays));

                lblTeamDelayHard = FindChild<XNALabel>(nameof(lblTeamDelayHard));
                lblTeamDelayMedium = FindChild<XNALabel>(nameof(lblTeamDelayMedium));
                lblTeamDelayEasy = FindChild<XNALabel>(nameof(lblTeamDelayEasy));

                tbTeamDelayHard = FindChild<EditorNumberTextBox>(nameof(tbTeamDelayHard));
                tbTeamDelayMedium = FindChild<EditorNumberTextBox>(nameof(tbTeamDelayMedium));
                tbTeamDelayEasy = FindChild<EditorNumberTextBox>(nameof(tbTeamDelayEasy));
                btnApply = FindChild<EditorButton>(nameof(btnApply));

                teamDelayControls.AddRange(new List<XNAControl>
                {
                    lblTeamDelayHard, lblTeamDelayMedium, lblTeamDelayEasy,
                    tbTeamDelayHard, tbTeamDelayMedium, tbTeamDelayEasy
                });

                chkOverrideTeamDelays.CheckedChanged += ChkOverrideTeamDelays_CheckedChanged;
                btnApply.LeftClick += BtnApply_LeftClick;
            }

            private void ChkOverrideTeamDelays_CheckedChanged(object sender, EventArgs e)
            {
                foreach (var teamDelayControl in teamDelayControls)
                {
                    if (chkOverrideTeamDelays.Checked)
                        teamDelayControl.Enable();
                    else
                        teamDelayControl.Disable();
                }
            }

            private void BtnApply_LeftClick(object sender, InputEventArgs e)
            {
                bool writeTeamDelays = chkOverrideTeamDelays.Checked;

                if (writeTeamDelays)
                {
                    if (!IsValidTeamDelay(tbTeamDelayHard.Value) ||
                    !IsValidTeamDelay(tbTeamDelayMedium.Value) ||
                    !IsValidTeamDelay(tbTeamDelayEasy.Value))
                    {
                        EditorMessageBox.Show(WindowManager,
                            Translator.Translate("SetMapDifficultySettings.InvalidTeamDelay.Title", "Invalid Team Delay"),
                            Translator.Translate("SetMapDifficultySettings.InvalidTeamDelay.Description", "One or more of the team delay values are not valid. Team Delays must be positive integers."),
                            MessageBoxButtons.OK);

                        return;
                    }
                }

                var loadedMapIni = scriptDependencies.Map.LoadedINI;

                var section = loadedMapIni.GetSection(sectionName);
                if (writeTeamDelays)
                {
                    // Create section if does not exist yet
                    if (section == null)
                    {
                        section = new IniSection(sectionName);
                        loadedMapIni.AddSection(section);
                    }

                    List<int> teamDelays = new List<int> { tbTeamDelayHard.Value, tbTeamDelayMedium.Value, tbTeamDelayEasy.Value };
                    section.SetListValue(keyName, teamDelays, ',');
                }
                else
                {
                    if (section != null)
                    {
                        section.RemoveKey(keyName);

                        // If there are no other keys for the General section after removing the Team Delays key, remove the section entirely.
                        if (section.Keys.Count == 0)
                            loadedMapIni.RemoveSection(sectionName);
                    }
                }

                EditorMessageBox.Show(WindowManager,
                            Translator.Translate("SetMapDifficultySettings.Apply.Title", "Success!"),
                            Translator.Translate("SetMapDifficultySettings.Apply.Description", "Difficulty settings were were successfully set. Save the map in order to write the values to it."),
                            MessageBoxButtons.OK);

                Hide();
            }

            private bool LoadTeamDelayValues()
            {
                bool writeTeamDelays = false;
                string[] teamDelays = null;

                var section = scriptDependencies.Map.LoadedINI.GetSection(sectionName);
                if (section != null)
                {
                    teamDelays = section.GetListValue(keyName, ',', s => s.Trim()).ToArray();
                    if (teamDelays.Length > 0)
                    {
                        if (teamDelays.Length != 3)
                        {
                            EditorMessageBox.Show(WindowManager,
                                Translator.Translate("InvalidTeamDelaysLoadingCount.Title", "Invalid TeamDelays= length"),
                                Translator.Translate("InvalidTeamDelaysLoadingCount.Description", $"Invalid amount of TeamDelays=, expected 3 but got {teamDelays.Length}. Defaulting to no team delays."),
                                MessageBoxButtons.OK);
                        
                            return false;
                        }

                        foreach (var teamDelay in teamDelays)
                        {
                            if (!IsValidTeamDelay(teamDelay))
                            {
                                EditorMessageBox.Show(WindowManager,
                                Translator.Translate("InvalidTeamDelaysLoadingValue.Title", "Invalid TeamDelays values"),
                                Translator.Translate("InvalidTeamDelaysLoadingValue.Description", $"One or more TeamDelays= values are invalid. Check that each TeamDelay value is a positive integer."),
                                MessageBoxButtons.OK);
                                    
                                return false;
                            }
                        }

                        writeTeamDelays = true;
                    }
                    else
                    {
                        teamDelays = null;
                    }
                }

                if (writeTeamDelays)
                {
                    chkOverrideTeamDelays.Checked = true;
                    foreach (var teamDelayControl in teamDelayControls)
                    {
                        teamDelayControl.Enable();
                    }
                }
                else
                {
                    chkOverrideTeamDelays.Checked = false;
                    foreach (var teamDelayControl in teamDelayControls)
                    {
                        teamDelayControl.Disable();
                    }
                }

                tbTeamDelayHard.Text = teamDelays == null ? string.Empty : teamDelays[0];
                tbTeamDelayMedium.Text = teamDelays == null ? string.Empty : teamDelays[1];
                tbTeamDelayEasy.Text = teamDelays == null ? string.Empty : teamDelays[2];

                return true;
            }

            private bool IsValidTeamDelay(int teamDelay)
            {                
                return teamDelay > 0;
            }

            private bool IsValidTeamDelay(string teamDelay)
            {
                bool valid = int.TryParse(teamDelay, out int parsedTeamDelay);

                if (!valid)
                    return false;                

                return IsValidTeamDelay(parsedTeamDelay);
            }

            public void Open()
            {
                bool isLoadingSucceeded = LoadTeamDelayValues();
                if (!isLoadingSucceeded)
                    return;

                Show();
            }

            /// <summary>
            /// Unsubscribe from event handlers to allow the garbage collector to clean up memory when the window is destroyed.
            /// </summary>
            public override void Kill()
            {
                btnApply.LeftClick -= BtnApply_LeftClick;
                base.Kill();
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

        private SetMapDifficultySettingsWindow setMapDifficultySettingsWindow;

        /// <summary>
        /// Main function for executing the script.
        /// </summary>
        public void Perform()
        {
            setMapDifficultySettingsWindow = new SetMapDifficultySettingsWindow(ScriptDependencies.WindowManager, ScriptDependencies);
            ScriptDependencies.WindowController.AddWindow(setMapDifficultySettingsWindow);
            setMapDifficultySettingsWindow.Closed += SetMapDifficultySettingsWindow_Closed;
            ScriptDependencies.WindowManager.AddCallback(new Action(() => setMapDifficultySettingsWindow.Open()));
        }

        private void SetMapDifficultySettingsWindow_Closed(object sender, EventArgs e)
        {
            setMapDifficultySettingsWindow.Closed -= SetMapDifficultySettingsWindow_Closed;            
            ScriptDependencies.WindowController.RemoveWindow(setMapDifficultySettingsWindow);
        }
    }
}