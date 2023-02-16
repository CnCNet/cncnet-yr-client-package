# .Net7 Migration Guide

This outlines the necessary steps to upgrade the YR mod for the new .net7 based xna-cncnet-client.

## Steps Taken
- Delete all existing binaries, except updater. See [Removing Old Binaries](#removing-old-binaries) below.
- Update necessary properties in the `/tools/download-artifacts/artifacts-config.json` file. For more detail on the properties, see the [Download Artifacts](#download-artifacts) section.

## Removing Old Binaries

Do NOT remove the old updater yet. There is a new version of the updater that will be included in the net7 update, but the old updater must be available during the net7 update to successfully perform the update. This includes the following files:
  - `/clientupdt.dat`
  - `/Resources/Binaries/ClientUpdater.dll`

All files to be removed should be included in the `updateexec` file.
Assuming that the package repo contains binary files, the easiest way to identify these files is to delete the Binaries folder from the this package repo (excluding the updater files mentioned above), run the download artifacts tool (below), then use git status to see which files are "missing".

It should be noted that we can never assume that a given user is coming from a specific client version. As a result, if we were to ever use the new updater to remove the updater, we would need to perform a "multi stage" update:
1. Create a new version of the client package on the existing cncnet server path specified in `updateconfig.ini` where an UPDATED copy of the `updateconfig.ini` file is downloaded and contains a new path on the cncnet server. This is the "first stage" in the "multi stage" update.
   1. Example: The last package version on the cncnet server path `/yr` contains an `updateconfig.ini` file that contains the cncnet server path of `/yrnew`.
2. Create a new version of the client package on the NEW cncnet server path (`yrnew` from the example above). This is the "second stage" of the "multi stage" update.

Basically, the first stage is nothing more than an update to the `updateconfig.ini` file to immediately point the client to a new cncnet server path. Upon the client restarting from that first stage, it will see that there is a new update immediately available on the new cncnet server path.

## Download Artifacts

There is a powershell script (`/tools/download-artifacts/download-client.ps1`) that will download specific xna-cncnet-client binaries. Similarly, there is a powershell (`/tools/download-artifacts/download-client-launcher.ps1`) that will download a specific client launcher version.
The versions that are downloaded are specified in `/tools/download-artifacts/artifacts-config.json`.

This is NOT currently capable of being an automated script. That's because the `xna-cncnet-client` currently provides binaries only via workflow run artifacts. Github has a retention policy on workflow run artifacts. This means that at some point in the future, this script would be unable to download the artifacts for a given workflow run ID during an automated process.

As a result, we must leave this as a locally run manual operation for now to download updated binaries when we know new ones exist and then commit them to this repository.

### Config properties:
- `githubApiVersion`: This is the version of the Github API to use in requests.
- `clientWorkflowRunId`: This is the workflow run ID to download the latest build artifacts from for the xna-cncnet-client. This can be found by going to the following URL, clicking on a given workflow run, and then grabbing the ID from the URL:
  - All workflow runs: `https://github.com/CnCNet/xna-cncnet-client/actions`
  - Example workflow run URL: `https://github.com/CnCNet/xna-cncnet-client/actions/runs/<workflowRunId>`
- `clientArtifactName`: This is the name of the artifact to download from the workflow run for the `xna-cncnet-client`.
  - Example: `artifacts-YR`
- `launcherReleaseTagName`: This is the version of the client launcher to download. Client launcher releases are found here: `https://github.com/CnCNet/dta-mg-client-launcher/releases`. Simply use one of the version names exactly as specified for this config property. 
  - Example: `v2.0.4`
- `launcherName`: The client launcher has the name `CnCNet.LauncherStub.exe` when downloaded. This config property specifies the name that this script will rename it to.
  - Example: `CnCNetYRLauncher.exe`

### Actions Taken in Script
- Retrieve a list of the build artifacts for the workflow run ID specified and download the artifact by the name specified, if it exists.
- Extract the contents of the artifacts zip downloaded.
- Move all files from the extracted files to the `/package/Resources` folder.
- Download the client launcher for the version specified using the `launcherReleaseTagName`.
- Extract the contents of the launcher zip.
- Rename and move the launcher to `/package/Resources` with the name specified by the `launcherName` property.
