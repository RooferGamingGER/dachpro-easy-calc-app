
export interface AddressResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    country?: string;
    state?: string;
    village?: string;
    town?: string;
    hamlet?: string;
    suburb?: string;
    neighbourhood?: string;
    city_district?: string;
  };
}

export interface AddressOption {
  value: string;
  label: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
