
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
