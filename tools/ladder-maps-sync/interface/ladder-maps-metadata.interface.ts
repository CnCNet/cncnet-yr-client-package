/**
 * Metadata for a single ladder map
 */
export interface LadderMapMetadata {
  /** SHA-1 hash of the map file */
  hash: string;
  /** Stable map ID from ladder API for tracking updates */
  mapId: number;
  /** Ladder GameMode (e.g., "Blitz", "Blitz 2v2", "YR Ladder", "RA2 Ladder") */
  gameMode: string;
  /** Source ladder pool name (e.g., "blitz", "blitz-2v2", "YR", "RA2") */
  ladder: string;
  /** ISO 8601 timestamp when the map was downloaded */
  downloadedAt: string;
  /** Original map name from ladder API */
  originalName?: string;
}

/**
 * Complete metadata file structure
 */
export interface LadderMapsMetadataFile {
  /** Metadata format version */
  version: string;
  /** ISO 8601 timestamp of last sync operation */
  lastSync: string;
  /** Map metadata, keyed by filename (without .map extension) */
  maps: Record<string, LadderMapMetadata>;
}
