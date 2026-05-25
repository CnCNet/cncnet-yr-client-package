export interface LadderPoolConfig {
  name: string;
  gameMode: string;
  apiEndpoint: string;
  fileNamePattern: string;
  enabled: boolean;
  description?: string;
}

export interface LadderMapsConfig {
  ladderPools: LadderPoolConfig[];
  settings: SyncSettings;
}

export interface SyncSettings {
  mapDatabaseUrl: string;
  mapImageBaseUrl: string;
  mapsDirectory: string;
  mpMapsIniPath: string;
  tempDirectory: string;
  download: DownloadSettings;
  logging: LoggingSettings;
}

export interface DownloadSettings {
  maxConcurrent: number;
  maxRetries: number;
  retryDelayMs: number;
  timeoutMs: number;
}

export interface LoggingSettings {
  level: 'debug' | 'info' | 'warn' | 'error';
  file: string;
}
