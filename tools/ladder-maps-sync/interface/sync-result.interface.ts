export interface SyncResult {
  totalMapsInLadder: number;
  existingMaps: number;
  downloadedMaps: number;
  updatedMaps: number;
  deletedMaps: number;
  failedDownloads: DownloadFailure[];
  errors: Error[];
}

export interface DownloadFailure {
  hash: string;
  mapName: string;
  error: string;
}
