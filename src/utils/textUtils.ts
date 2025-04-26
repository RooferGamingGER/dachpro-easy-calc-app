
/**
 * Normalizes German text for better searching and matching
 * - Converts ß to ss and vice versa
 * - Handles umlauts (ä, ö, ü)
 * - Removes special characters
 */
export function normalizeGermanText(text: string): string {
  if (!text) return '';

  // First normalize to NFC form (canonical composed)
  let normalizedText = text.normalize('NFC');
  
  // Common German character replacements for search tolerance
  normalizedText = normalizedText
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'A')
    .replace(/ä/g, 'a')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u');
  
  // Common street name typo corrections
  normalizedText = normalizedText
    .replace(/strasse/gi, 'str')
    .replace(/straße/gi, 'str')
    .replace(/str\./gi, 'str');
    
  // Standardize spacing
  normalizedText = normalizedText.replace(/\s+/g, ' ').trim();
  
  return normalizedText;
}
