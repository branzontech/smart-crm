
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, File, FileImage, FileText } from "lucide-react";

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  // Crear URLs de previsualización cuando se seleccionen nuevos archivos
  useEffect(() => {
    // Limpiar las URLs de previsualización anteriores
    return () => files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files) as FileWithPreview[];
      
      // Validar tamaño de archivos (5MB = 5 * 1024 * 1024 bytes)
      const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024).map(file => {
        // Crear URL de previsualización para imágenes solamente
        if (file.type.startsWith('image/')) {
          return Object.assign(file, {
            preview: URL.createObjectURL(file)
          });
        }
        return file;
      });
      
      if (validFiles.length !== newFiles.length) {
        alert("Algunos archivos exceden el límite de 5MB y no serán incluidos.");
      }

      setFiles(prev => [...prev, ...validFiles]);
      onFilesChange([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="w-8 h-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <Card className="mb-6 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Archivos Adjuntos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 border-gray-300 hover:border-teal">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-teal" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold text-teal">Haga clic para cargar</span> o arrastre y suelte
                </p>
                <p className="text-xs text-gray-500">Imágenes o PDFs (máx. 5MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  {file.preview ? (
                    <div className="relative aspect-video">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center aspect-video bg-gray-100">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 p-1 h-auto ml-2"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
