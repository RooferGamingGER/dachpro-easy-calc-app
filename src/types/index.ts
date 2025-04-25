
export interface Project {
  id: string;
  name: string;
  customer: string;
  address: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  measurements?: Measurement;
  photos?: Photo[];
  materials?: Material[];
  coordinates?: Coordinates;
  roofPolygon?: GeoPolygon;
}

export interface Measurement {
  length: number;
  width: number;
  pitch: number;
  area: number;
}

export interface Photo {
  id: string;
  url: string;
  notes: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeoPolygon {
  points: Coordinates[];
  area: number;
}
