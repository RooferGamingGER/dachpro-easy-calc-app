
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Project, Measurement } from "@/types";
import { calculateRoofArea } from "@/utils/calculations";

interface RoofCalculatorProps {
  project: Project;
  onSave: (measurements: Measurement) => void;
}

export const RoofCalculator: React.FC<RoofCalculatorProps> = ({
  project,
  onSave
}) => {
  const initialMeasurements = project.measurements || {
    length: 0,
    width: 0,
    pitch: 30,
    area: 0
  };
  
  const [length, setLength] = useState<number>(initialMeasurements.length);
  const [width, setWidth] = useState<number>(initialMeasurements.width);
  const [pitch, setPitch] = useState<number>(initialMeasurements.pitch);
  const [area, setArea] = useState<number>(initialMeasurements.area);
  
  // Calculate area when inputs change
  useEffect(() => {
    const calculatedArea = calculateRoofArea(length, width, pitch);
    setArea(calculatedArea);
  }, [length, width, pitch]);
  
  const handleSliderChange = (value: number[]) => {
    setPitch(value[0]);
  };
  
  const handleSave = () => {
    onSave({
      length,
      width,
      pitch,
      area
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="p-6 bg-dachpro-gray-light rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Dachmaße eingeben</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Länge (m)</Label>
              <Input
                id="length"
                type="number"
                min="0"
                step="0.1"
                value={length || ""}
                onChange={(e) => handleInputChange(e, setLength)}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width">Breite (m)</Label>
              <Input
                id="width"
                type="number"
                min="0"
                step="0.1"
                value={width || ""}
                onChange={(e) => handleInputChange(e, setWidth)}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="pitch">Dachneigung ({pitch}°)</Label>
            </div>
            <Slider
              id="pitch"
              min={0}
              max={60}
              step={1}
              value={[pitch]}
              onValueChange={handleSliderChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-dachpro-gray">
              <span>0°</span>
              <span>30°</span>
              <span>60°</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Berechnete Fläche</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-dachpro-blue">
              {area} m²
            </p>
            <p className="text-sm text-dachpro-gray">
              {length}m × {width}m bei {pitch}° Neigung
            </p>
          </div>
          <Button 
            onClick={handleSave}
            className="touch-button bg-dachpro-blue hover:bg-dachpro-blue-light text-white"
            disabled={!length || !width || area <= 0}
          >
            Übernehmen
          </Button>
        </div>
      </div>
    </div>
  );
};
