
import { useState, useEffect } from 'react';
import { AddressResult, AddressOption } from '@/types/address';
import { useDebounce } from '@/hooks/useDebounce';

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

        if (!response.ok) throw new Error('Fehler bei der Adresssuche');

        const results: AddressResult[] = await response.json();
        
        const formattedOptions: AddressOption[] = results.map((result) => {
          const address = result.address;
          const label = [
            address.road || '',
            address.house_number ? address.house_number : '',
            address.postcode || '',
            address.city || ''
          ].filter(Boolean).join(' ');

          return {
            value: result.place_id.toString(),
            label: label.trim(),
            coordinates: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon)
            }
          };
        });

        setOptions(formattedOptions.filter(option => option.label.length > 0));
      } catch (error) {
        console.error('Address search error:', error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchAddress();
  }, [debouncedQuery]);

  return { options, isLoading };
}
