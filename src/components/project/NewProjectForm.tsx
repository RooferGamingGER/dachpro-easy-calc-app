
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Project } from "@/types";
import { geocodeAddress } from "@/utils/geocoding";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NewProjectFormProps {
  onSave: (project: Project) => void;
  onCancel: () => void;
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({ onSave, onCancel }) => {
  const { toast: uiToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    customer: "",
    address: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.customer || !formData.address) {
      uiToast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Geocode the address
      const coordinates = await geocodeAddress(formData.address);
      
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        coordinates: coordinates || undefined
      };
      
      onSave(newProject);
      
      if (!coordinates) {
        toast("Hinweis", {
          description: "Projekt wurde gespeichert, aber die Adresse konnte nicht georeferenziert werden."
        });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      uiToast({
        title: "Fehler",
        description: "Projekt konnte nicht erstellt werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Projektname *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="z.B. Dacherneuerung Meier"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer">Kunde *</Label>
          <Input
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="input-field"
            placeholder="Name des Kunden"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input-field"
            placeholder="Vollständige Adresse"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field min-h-[100px]"
            placeholder="Zusätzliche Informationen zum Projekt"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="touch-button"
        >
          Abbrechen
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="touch-button bg-dachpro-blue hover:bg-dachpro-blue-light text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verarbeite...
            </>
          ) : (
            "Projekt erstellen"
          )}
        </Button>
      </div>
    </form>
  );
};
