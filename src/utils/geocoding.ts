
import { Coordinates } from "@/types";
import { toast } from "sonner";
import { normalizeGermanText } from "./textUtils";

// Function to convert an address to coordinates using Nominatim (OpenStreetMap)
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  if (!address || address.trim().length < 5) {
    toast("Ungültige Adresse", {
      description: "Die Adresse ist zu kurz oder ungültig."
    });
    return null;
  }
  
  try {
    // Normalize the address for better search results
    const normalizedAddress = normalizeGermanText(address);
    const encodedAddress = encodeURIComponent(normalizedAddress);
    
    // Using multiple parameters to improve search accuracy
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&addressdetails=1&limit=1&accept-language=de`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      // Try a second attempt with more permissive parameters
      const secondResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&street=${encodedAddress}&limit=1&accept-language=de`
      );
      
      if (!secondResponse.ok) {
        throw new Error('Second geocoding request failed');
      }
      
      const secondData = await secondResponse.json();
      
      if (secondData.length === 0) {
        toast("Adresse nicht gefunden", {
          description: "Die angegebene Adresse konnte nicht georeferenziert werden",
          style: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }
        });
        return null;
      }
      
      return {
        lat: parseFloat(secondData[0].lat),
        lng: parseFloat(secondData[0].lon)
      };
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
