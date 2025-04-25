
import { Measurement, Coordinates } from "@/types";

// Calculate roof area based on length, width and pitch
export const calculateRoofArea = (
  length: number,
  width: number,
  pitch: number
): number => {
  if (!length || !width || pitch === undefined) return 0;
  
  // Convert pitch angle to radians
  const pitchRadians = (pitch * Math.PI) / 180;
  
  // Calculate the factor for the angled surface
  // 1 / cos(pitch) gives us how much longer the angled roof is compared to the horizontal projection
  const factor = 1 / Math.cos(pitchRadians);
  
  // Calculate the roof area
  const area = length * width * factor;
  
  // Round to two decimal places
  return Math.round(area * 100) / 100;
};

// Calculate materials needed based on roof area
export const calculateMaterials = (area: number): Record<string, number> => {
  return {
    dachziegel: Math.ceil(area * 10), // 10 tiles per m²
    lattung: Math.ceil(area * 1.5), // 1.5 meters per m²
    folie: Math.ceil(area * 1.1), // 1.1 m² of foil per m² (accounting for overlap)
    firstziegel: Math.ceil(Math.sqrt(area) * 0.3), // Approximate ridge tile count
  };
};

// Estimate project cost - very simple estimation for the prototype
export const estimateProjectCost = (area: number): number => {
  const materials = calculateMaterials(area);
  
  // Simple cost model for the prototype
  const costPerTile = 1.2; // € per tile
  const costPerMeterLattung = 2.5; // € per meter
  const costPerM2Folie = 5; // € per m²
  const costPerFirstziegel = 3; // € per ridge tile
  const laborCostPerM2 = 40; // € labor cost per m²
  
  const materialCost = 
    materials.dachziegel * costPerTile + 
    materials.lattung * costPerMeterLattung + 
    materials.folie * costPerM2Folie * area + 
    materials.firstziegel * costPerFirstziegel;
  
  const laborCost = area * laborCostPerM2;
  
  return Math.round((materialCost + laborCost) * 100) / 100;
};

// Calculate area of polygon from coordinates
export const calculatePolygonArea = (points: Coordinates[]): number => {
  if (points.length < 3) return 0;
  
  // Implementation of the Shoelace formula (Gauss's area formula)
  let area = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].lat * points[j].lng;
    area -= points[j].lat * points[i].lng;
  }
  
  area = Math.abs(area) / 2;
  
  // Convert to square meters (approximation using the Haversine formula)
  // This is an approximation for small areas
  const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const metersPerLatDegree = 111320; // meters per degree of latitude
  const metersPerLngDegree = 111320 * Math.cos(lat * (Math.PI / 180)); // meters per degree of longitude
  
  const areaInSquareMeters = area * metersPerLatDegree * metersPerLngDegree;
  
  return Math.round(areaInSquareMeters * 100) / 100;
};
