
import React from "react";
import { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onDeleteProject
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-dachpro-gray mb-2">Keine Projekte vorhanden</h3>
        <p className="text-dachpro-gray">Erstellen Sie ein neues Projekt, um loszulegen</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={onSelectProject}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
};
