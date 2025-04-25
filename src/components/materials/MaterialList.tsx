
import React from "react";
import { Project } from "@/types";
import { calculateMaterials, estimateProjectCost } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface MaterialListProps {
  project: Project;
}

export const MaterialList: React.FC<MaterialListProps> = ({ project }) => {
  const { toast } = useToast();
  
  if (!project.measurements?.area) {
    return (
      <div className="text-center py-6">
        <p className="text-dachpro-gray">Bitte führen Sie zuerst eine Flächenberechnung durch</p>
      </div>
    );
  }
  
  const area = project.measurements.area;
  const materials = calculateMaterials(area);
  const estimatedCost = estimateProjectCost(area);
  
  const handleGeneratePDF = () => {
    generatePDF(project);
    toast({
      title: "PDF erstellt",
      description: "Das Angebot wurde als PDF generiert",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Materialliste</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Material</span>
            <span className="font-medium">Menge</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span>Dachziegel</span>
            <span>{materials.dachziegel} Stück</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span>Lattung</span>
            <span>{materials.lattung} Meter</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span>Unterspannbahn</span>
            <span>{Math.ceil(area * 1.1)} m²</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span>Firstziegel</span>
            <span>{materials.firstziegel} Stück</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-dachpro-gray-light rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-1">Geschätzter Preis</h3>
            <p className="text-2xl font-bold text-dachpro-blue">
              {estimatedCost.toLocaleString('de-DE')} €
            </p>
            <p className="text-xs text-dachpro-gray">inkl. Material und Arbeitsaufwand</p>
          </div>
          <Button
            onClick={handleGeneratePDF}
            className="touch-button bg-dachpro-blue hover:bg-dachpro-blue-light text-white"
          >
            Angebot erstellen
          </Button>
        </div>
      </div>
    </div>
  );
};
