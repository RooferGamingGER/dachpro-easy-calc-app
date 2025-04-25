
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Photo } from "@/types";

interface FileUploadProps {
  onUpload: (photo: Photo) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ungültige Datei",
          description: "Bitte wählen Sie ein Bild aus",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };
  
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleSave = () => {
    if (!selectedFile || !preview) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie zuerst ein Bild aus",
        variant: "destructive",
      });
      return;
    }
    
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url: preview,
      notes: notes
    };
    
    onUpload(newPhoto);
    resetForm();
    
    toast({
      title: "Foto gespeichert",
      description: "Das Foto wurde erfolgreich hochgeladen",
    });
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setNotes("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      {!preview ? (
        <div 
          onClick={handleSelectFile}
          className="border-2 border-dashed border-dachpro-gray rounded-lg p-8 text-center cursor-pointer hover:bg-dachpro-gray-light transition-colors"
        >
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-dachpro-gray mb-2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-dachpro-gray font-medium">Klicken Sie hier, um ein Foto auszuwählen</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={preview} 
              alt="Vorschau" 
              className="w-full h-auto rounded-lg object-cover max-h-[300px]" 
            />
            <Button
              variant="outline"
              onClick={resetForm}
              className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 p-1"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anmerkungen zum Foto (optional)"
              className="input-field"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="touch-button bg-dachpro-blue hover:bg-dachpro-blue-light text-white"
            >
              Foto speichern
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
