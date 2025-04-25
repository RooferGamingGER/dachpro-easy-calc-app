
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onSelect,
  onDelete
}) => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('de-DE');
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{project.name}</span>
          {project.measurements?.area && (
            <span className="text-sm font-normal text-dachpro-gray bg-dachpro-gray-light px-2 py-1 rounded">
              {project.measurements.area} m²
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Kunde:</span> {project.customer}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Adresse:</span> {project.address}
          </p>
          {project.description && (
            <p className="text-sm">
              <span className="font-semibold">Beschreibung:</span> {project.description}
            </p>
          )}
          <p className="text-xs text-dachpro-gray mt-2">
            Erstellt am: {formatDate(project.createdAt)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={() => onSelect(project)}
          className="bg-dachpro-blue hover:bg-dachpro-blue-light text-white"
        >
          Öffnen
        </Button>
        <Button 
          variant="outline"
          onClick={() => onDelete(project.id)}
          className="border-dachpro-gray text-dachpro-gray hover:bg-dachpro-gray-light"
        >
          Löschen
        </Button>
      </CardFooter>
    </Card>
  );
};
