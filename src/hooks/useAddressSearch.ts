
import { useState, useEffect } from 'react';
import { AddressResult, AddressOption } from '@/types/address';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from "sonner";

export function useAddressSearch(query: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<AddressOption[]>([]);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const searchAddress = async () => {
      if (debouncedQuery.length < 3) {
        setOptions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            debouncedQuery
          )}&addressdetails=1&limit=5&accept-language=de`
        );

        if (!response.ok) {
          throw new Error('Fehler bei der Adresssuche');
        }

        const results: AddressResult[] = await response.json();
        
        if (results.length === 0) {
          setOptions([]);
          return;
        }
        
        const formattedOptions: AddressOption[] = results.map((result) => {
          const address = result.address;
          
          // Format the address in a readable German format
          let addressParts = [];
          
          if (address.road) {
            addressParts.push(address.road + (address.house_number ? ' ' + address.house_number : ''));
          }
          
          if (address.postcode || address.city) {
            let locationPart = '';
            if (address.postcode) locationPart += address.postcode;
            if (address.city) locationPart += (locationPart ? ' ' : '') + address.city;
            addressParts.push(locationPart);
          }
          
          if (addressParts.length === 0) {
            // Fallback to display_name if we couldn't extract structured address parts
            return {
              value: result.place_id.toString(),
              label: result.display_name,
              coordinates: {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
              }
            };
          }
          
          return {
            value: result.place_id.toString(),
            label: addressParts.join(', '),
            coordinates: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon)
            }
          };
        });

        setOptions(formattedOptions);
      } catch (error) {
        console.error('Address search error:', error);
        toast("Fehler bei der Adresssuche", {
          description: "Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
        });
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchAddress();
  }, [debouncedQuery]);

  return { options, isLoading };
}
