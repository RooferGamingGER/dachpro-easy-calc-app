
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Project } from "@/types";

interface NewProjectFormProps {
  onSave: (project: Project) => void;
  onCancel: () => void;
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({ onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    customer: "",
    address: "",
    description: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.customer || !formData.address) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSave(newProject);
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
          className="touch-button"
        >
          Abbrechen
        </Button>
        <Button 
          type="submit"
          className="touch-button bg-dachpro-blue hover:bg-dachpro-blue-light text-white"
        >
          Projekt erstellen
        </Button>
      </div>
    </form>
  );
};
