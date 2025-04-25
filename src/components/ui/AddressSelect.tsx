
import React, { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAddressSearch } from "@/hooks/useAddressSearch";
import { AddressOption } from "@/types/address";
import { Loader2, Check, Search, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  onAddressSelect: (address: AddressOption) => void;
}

export function AddressSelect({
  value,
  onValueChange,
  onAddressSelect,
}: AddressSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || "");
  const { options, isLoading } = useAddressSearch(searchQuery);
  
  // Update search query when external value changes
  useEffect(() => {
    if (value && value !== searchQuery) {
      setSearchQuery(value);
    }
  }, [value]);

  const handleSelect = (selectedOption: AddressOption) => {
    onValueChange(selectedOption.label);
    onAddressSelect(selectedOption);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Adresse eingeben..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value);
              if (value !== searchQuery) {
                onValueChange(value);
              }
            }}
            placeholder="Suche nach einer Adresse..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Suche...</span>
                </div>
              ) : searchQuery.length < 3 ? (
                <div className="flex items-center justify-center p-4">
                  <Info className="h-4 w-4" />
                  <span className="ml-2">Mindestens 3 Zeichen eingeben</span>
                </div>
              ) : (
                "Keine Adressen gefunden"
              )}
            </CommandEmpty>
            <CommandGroup heading="Gefundene Adressen">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option)}
                  className="flex items-center"
                >
                  <div className="flex-grow text-sm truncate">{option.label}</div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === option.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
