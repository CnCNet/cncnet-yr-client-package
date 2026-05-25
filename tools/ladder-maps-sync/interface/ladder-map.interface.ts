export interface LadderMap {
  id: number;
  ladder_id: number;
  map_id: number;
  description: string;
  bit_idx: number;
  valid: number;
  spawn_order: string;
  created_at: string;
  updated_at: string;
  team1_spawn_order: string;
  team2_spawn_order: string;
  allowed_sides: number[];
  admin_description: string;
  map_pool_id: number;
  rejectable: number;
  default_reject: number;
  random_spawns: number;
  map_tier: number;
  weight: number;
  hash: string;
  map: MapDetails;
}

export interface MapDetails {
  id: number;
  hash: string;
  name: string;
  ladder_id: number;
  spawn_count: number;
  image_path: string;
  image_hash: string;
  filename: string;
  is_active: number;
  image_url: string;
}
