
import { Coordinates } from "@/types";
import { toast } from "sonner";

// Function to convert an address to coordinates using Nominatim (OpenStreetMap)
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      toast("Adresse nicht gefunden", {
        description: "Die angegebene Adresse konnte nicht gefunden werden",
        style: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }
      });
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error("Error geocoding address:", error);
    toast("Geocoding Fehler", {
      description: "Die Adresse konnte nicht in Koordinaten umgewandelt werden",
      style: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }
    });
    return null;
  }
};
