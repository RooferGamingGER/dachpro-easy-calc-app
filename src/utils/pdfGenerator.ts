
import { Project, Material } from "@/types";
import { calculateMaterials, estimateProjectCost } from "./calculations";

// Mock PDF generation - in a real app this would use a library like pdfmake or jsPDF
export const generatePDF = (project: Project): void => {
  console.log("Generating PDF for project:", project);
  
  // In a real implementation, this is where we would create the PDF
  alert(
    "PDF-Angebot wurde generiert (Simuliert).\n\n" +
    `Projekt: ${project.name}\n` +
    `Kunde: ${project.customer}\n` +
    `Adresse: ${project.address}\n` +
    `Fläche: ${project.measurements?.area} m²\n` +
    `Geschätzter Preis: ${estimateProjectCost(project.measurements?.area || 0)}€`
  );
  
  // For a real implementation, we would use a library like jsPDF:
  /*
  import { jsPDF } from 'jspdf';
  
  const doc = new jsPDF();
  doc.text(`Angebot: ${project.name}`, 20, 20);
  doc.text(`Kunde: ${project.customer}`, 20, 30);
  doc.text(`Adresse: ${project.address}`, 20, 40);
  doc.text(`Fläche: ${project.measurements?.area} m²`, 20, 50);
  
  // Add materials
  doc.text("Materialien:", 20, 70);
  let y = 80;
  project.materials?.forEach((material, i) => {
    doc.text(`${material.name}: ${material.quantity} ${material.unit}`, 30, y + i*10);
  });
  
  // Add price
  doc.text(`Geschätzter Gesamtpreis: ${estimateProjectCost(project.measurements?.area || 0)}€`, 20, y + 30);
  
  // Save the PDF
  doc.save(`Angebot_${project.name}.pdf`);
  */
};

// Function to prepare project data for PDF
export const preparePdfData = (project: Project) => {
  if (!project.measurements?.area) {
    return {
      ...project,
      materials: [],
      estimatedCost: 0
    };
  }
  
  const area = project.measurements.area;
  const materialCalculations = calculateMaterials(area);
  
  const materials: Material[] = [
    {
      id: "1",
      name: "Dachziegel",
      quantity: materialCalculations.dachziegel,
      unit: "Stück"
    },
    {
      id: "2",
      name: "Lattung",
      quantity: materialCalculations.lattung,
      unit: "Meter"
    },
    {
      id: "3",
      name: "Unterspannbahn",
      quantity: area * 1.1,
      unit: "m²"
    },
    {
      id: "4",
      name: "Firstziegel",
      quantity: materialCalculations.firstziegel,
      unit: "Stück"
    }
  ];
  
  const estimatedCost = estimateProjectCost(area);
  
  return {
    ...project,
    materials,
    estimatedCost
  };
};
