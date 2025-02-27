
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, File } from "lucide-react";

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files) as FileWithPreview[];
      setFiles(prev => [...prev, ...newFiles]);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <Card className="mb-6 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Soportes del Recaudo</CardTitle>
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
                <p className="text-xs text-gray-500">Documentos, imágenes o PDFs</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-teal" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 p-1 h-auto"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
