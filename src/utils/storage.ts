
import { Project } from "@/types";
import { toast } from "@/components/ui/sonner";

// Local storage keys
const PROJECTS_KEY = "dachpro_projects";

// Get all projects from local storage
export const getProjects = (): Project[] => {
  try {
    const projects = localStorage.getItem(PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error("Error getting projects from storage:", error);
    return [];
  }
};

// Save all projects to local storage
export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Error saving projects to storage:", error);
    toast({
      title: "Fehler",
      description: "Projekte konnten nicht gespeichert werden",
      variant: "destructive",
    });
  }
};

// Get a single project by ID
export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find((project) => project.id === id);
};

// Save a new project or update an existing one
export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const existingProjectIndex = projects.findIndex((p) => p.id === project.id);

  if (existingProjectIndex >= 0) {
    // Update existing project
    projects[existingProjectIndex] = {
      ...projects[existingProjectIndex],
      ...project,
      updatedAt: new Date(),
    };
  } else {
    // Add new project
    projects.push({
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  saveProjects(projects);
  toast({
    title: "Gespeichert",
    description: "Projekt wurde erfolgreich gespeichert",
  });
};

// Delete a project by ID
export const deleteProject = (id: string): void => {
  const projects = getProjects();
  const updatedProjects = projects.filter((project) => project.id !== id);
  saveProjects(updatedProjects);
  toast({
    title: "Gelöscht",
    description: "Projekt wurde erfolgreich gelöscht",
  });
};
