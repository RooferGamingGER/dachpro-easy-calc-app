
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const commandListRef = useRef<HTMLDivElement>(null);
  const selectionInProgress = useRef(false);

  useEffect(() => {
    if (value && value !== searchQuery) {
      setSearchQuery(value);
    }
  }, [value]);

  // Handle selection after state updates are complete
  useEffect(() => {
    if (selectedValue && !selectionInProgress.current) {
      selectionInProgress.current = true;
      
      const selectedOption = options.find(option => option.label === selectedValue);
      if (selectedOption) {
        // Delay execution slightly to ensure UI events complete first
        setTimeout(() => {
          onValueChange(selectedOption.label);
          onAddressSelect(selectedOption);
          setSearchQuery(selectedValue);
          
          // Close popover after a short delay to ensure selection is registered
          setTimeout(() => {
            setOpen(false);
            setSelectedValue(null);
            selectionInProgress.current = false;
          }, 100);
        }, 50);
      } else {
        selectionInProgress.current = false;
        setSelectedValue(null);
      }
    }
  }, [selectedValue, options, onValueChange, onAddressSelect]);

  const handleSelect = useCallback((currentValue: string) => {
    // Prevent multiple selections while one is in progress
    if (selectionInProgress.current) return;
    
    // Set the selected value to trigger the effect
    setSelectedValue(currentValue);
    
    // Provide visual feedback
    if (isMobile) {
      // Flash background to indicate selection
      const selectedItem = document.querySelector(`[data-value="${currentValue}"]`);
      if (selectedItem) {
        selectedItem.classList.add('bg-accent');
        setTimeout(() => {
          selectedItem?.classList.remove('bg-accent');
        }, 200);
      }
    }
  }, [isMobile]);

  // Complete event prevention for mobile
  const preventEventBubbling = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    
    // For touch events, ensure we're getting the correct target
    if (e.type === 'touchend' && commandListRef.current) {
      // Prevent any scroll events
      commandListRef.current.style.overflowY = 'hidden';
      setTimeout(() => {
        if (commandListRef.current) {
          commandListRef.current.style.overflowY = 'auto';
        }
      }, 300);
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Adresse auswählen"
          className="w-full justify-between"
        >
          {value || "Adresse eingeben..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0" 
        align="start"
        sideOffset={8}
        ref={popoverRef}
        style={{ 
          maxWidth: isMobile ? '100vw' : '400px',
          width: isMobile ? 'calc(100vw - 32px)' : '100%',
          position: 'relative',
          zIndex: 9999 
        }}
        onInteractOutside={(e) => {
          // Prevent interaction outside while selection is in progress
          if (selectionInProgress.current) {
            e.preventDefault();
          }
        }}
      >
        <Command className="max-h-[300px] overflow-hidden">
          <CommandInput
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value);
              onValueChange(value);
            }}
            placeholder="Suche nach einer Adresse..."
            className="h-11 px-4"
          />
          <CommandList className="max-h-[250px] overflow-y-auto" ref={commandListRef}>
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
                  onSelect={handleSelect}
                  className="flex items-center cursor-pointer px-4 py-3 hover:bg-accent"
                  onTouchStart={preventEventBubbling}
                  onTouchEnd={preventEventBubbling}
                  onClick={preventEventBubbling}
                  aria-label={`Adresse auswählen: ${option.label}`}
                  data-value={option.label}
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
