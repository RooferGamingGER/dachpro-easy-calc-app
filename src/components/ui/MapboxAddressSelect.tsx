
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { MapboxFeature } from "@/types/mapbox";
import { toast } from "sonner";

interface MapboxAddressSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  onAddressSelect: (address: { label: string; coordinates: { lat: number; lng: number } }) => void;
}

export function MapboxAddressSelect({
  value,
  onValueChange,
  onAddressSelect,
}: MapboxAddressSelectProps) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("mapboxApiKey") || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && value !== query) {
      setQuery(value);
    }
  }, [value]);

  const searchAddress = async (searchQuery: string) => {
    if (!searchQuery || !apiKey) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${apiKey}&country=de&types=address&language=de`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching address:", error);
      toast("Fehler bei der Adresssuche", {
        description: "Bitte überprüfen Sie Ihre Internetverbindung und den API-Schlüssel.",
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onValueChange(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length >= 3) {
      timeoutRef.current = setTimeout(() => searchAddress(value), 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("mapboxApiKey", newApiKey);
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    setQuery(suggestion.place_name);
    onValueChange(suggestion.place_name);
    onAddressSelect({
      label: suggestion.place_name,
      coordinates: {
        lat: suggestion.center[1],
        lng: suggestion.center[0]
      }
    });
    setShowSuggestions(false);
  };

  if (!apiKey) {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded bg-yellow-50 text-yellow-800 text-sm">
          Bitte geben Sie Ihren Mapbox API-Schlüssel ein, um die Adresssuche zu aktivieren.
          Sie können einen kostenlosen Schlüssel auf mapbox.com erstellen.
        </div>
        <Input
          type="text"
          placeholder="Mapbox API-Schlüssel eingeben"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex relative">
        <Input
          type="text"
          placeholder="Adresse eingeben..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="w-full pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4 opacity-50" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-[300px] overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="ghost"
              className="w-full justify-start px-4 py-3 text-sm hover:bg-accent"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
