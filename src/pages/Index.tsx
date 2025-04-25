
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Navbar } from "@/components/layout/Navbar";
import { ProjectList } from "@/components/project/ProjectList";
import { NewProjectForm } from "@/components/project/NewProjectForm";
import { RoofCalculator } from "@/components/calculation/RoofCalculator";
import { MaterialList } from "@/components/materials/MaterialList";
import { FileUpload } from "@/components/ui/FileUpload";
import { Measurement, Photo, Project } from "@/types";
import { getProjects, saveProject, deleteProject } from "@/utils/storage";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("measurements");
  
  // Load projects from local storage
  useEffect(() => {
    const loadedProjects = getProjects();
    setProjects(loadedProjects);
  }, []);

  const handleNewProject = () => {
    setIsNewProjectDialogOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    saveProject(project);
    setProjects([...projects, project]);
    setIsNewProjectDialogOpen(false);
    setCurrentProject(project);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setProjects(projects.filter(project => project.id !== id));
    if (currentProject && currentProject.id === id) {
      setCurrentProject(null);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
  };

  const handleBackToList = () => {
    // Refresh project list in case there are changes
    setProjects(getProjects());
    setCurrentProject(null);
  };

  const handleSaveMeasurements = (measurements: Measurement) => {
    if (!currentProject) return;
    
    const updatedProject: Project = {
      ...currentProject,
      measurements,
      updatedAt: new Date()
    };
    
    saveProject(updatedProject);
    setCurrentProject(updatedProject);
  };
  
  const handleUploadPhoto = (photo: Photo) => {
    if (!currentProject) return;
    
    const photos = currentProject.photos || [];
    
    const updatedProject: Project = {
      ...currentProject,
      photos: [...photos, photo],
      updatedAt: new Date()
    };
    
    saveProject(updatedProject);
    setCurrentProject(updatedProject);
  };

  return (
    <div className="min-h-screen bg-gray-50 rooftop-bg">
      <Navbar onNewProject={handleNewProject} />

      <main className="container px-4 py-6 mx-auto max-w-7xl">
        {!currentProject ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-dachpro-gray-dark">Projektübersicht</h1>
            </div>
            <ProjectList
              projects={projects}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
            />
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-dachpro-blue hover:underline mb-2"
                >
                  ← Zurück zur Übersicht
                </button>
                <h1 className="text-2xl font-bold text-dachpro-gray-dark">
                  {currentProject.name}
                </h1>
                <p className="text-sm text-dachpro-gray">
                  {currentProject.customer} | {currentProject.address}
                </p>
              </div>
            </div>

            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="measurements">Flächen</TabsTrigger>
                <TabsTrigger value="materials">Material</TabsTrigger>
                <TabsTrigger value="photos">Fotos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="measurements" className="mt-6">
                <RoofCalculator 
                  project={currentProject}
                  onSave={handleSaveMeasurements}
                />
              </TabsContent>
              
              <TabsContent value="materials" className="mt-6">
                <MaterialList project={currentProject} />
              </TabsContent>
              
              <TabsContent value="photos" className="mt-6">
                <div className="space-y-6">
                  <FileUpload onUpload={handleUploadPhoto} />
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Gespeicherte Fotos</h3>
                    
                    {!currentProject.photos || currentProject.photos.length === 0 ? (
                      <p className="text-center py-6 text-dachpro-gray">
                        Keine Fotos vorhanden
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentProject.photos.map((photo) => (
                          <div key={photo.id} className="border rounded-lg overflow-hidden">
                            <img 
                              src={photo.url} 
                              alt="Projektfoto" 
                              className="w-full h-48 object-cover"
                            />
                            {photo.notes && (
                              <div className="p-3 bg-white">
                                <p className="text-sm">{photo.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Neues Projekt erstellen</DialogTitle>
          </DialogHeader>
          <NewProjectForm
            onSave={handleSaveProject}
            onCancel={() => setIsNewProjectDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
