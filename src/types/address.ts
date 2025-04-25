
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
