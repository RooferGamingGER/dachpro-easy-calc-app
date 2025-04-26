
export interface MapboxFeature {
  place_name: string;
  center: [number, number];
  id: string;
}

export interface MapboxResponse {
  features: MapboxFeature[];
}
