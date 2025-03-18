
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CompanyConfig, uploadCompanyLogo, deleteCompanyLogo } from "@/services/configService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, X, AtSign } from "lucide-react";
import { toast } from "sonner";

const companyConfigSchema = z.object({
  id: z.string().optional(),
  razon_social: z.string().min(1, "La razón social es requerida"),
  nit: z.string().min(1, "El NIT es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  contacto_principal: z.string().min(1, "El nombre del contacto principal es requerido"),
  telefono_secundario: z.string().optional(),
  logo_path: z.string().optional(),
  email: z.string().email("Ingrese un correo electrónico válido").optional().or(z.string().length(0))
});

interface CompanyConfigFormProps {
  initialData?: CompanyConfig | null;
  onSubmit: (data: CompanyConfig) => Promise<void>;
  onCancel?: () => void;
}

export function CompanyConfigForm({ initialData, onSubmit, onCancel }: CompanyConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_path || null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof companyConfigSchema>>({
    resolver: zodResolver(companyConfigSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      razon_social: initialData?.razon_social || "",
      nit: initialData?.nit || "",
      direccion: initialData?.direccion || "",
      telefono: initialData?.telefono || "",
      contacto_principal: initialData?.contacto_principal || "",
      telefono_secundario: initialData?.telefono_secundario || "",
      logo_path: initialData?.logo_path || "",
      email: initialData?.email || ""
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        razon_social: initialData.razon_social,
        nit: initialData.nit,
        direccion: initialData.direccion,
        telefono: initialData.telefono,
        contacto_principal: initialData.contacto_principal,
        telefono_secundario: initialData.telefono_secundario || "",
        logo_path: initialData.logo_path || "",
        email: initialData.email || ""
      });
      setLogoPreview(initialData.logo_path || null);
    }
  }, [initialData, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo no debe superar los 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Solo se permiten archivos de imagen");
        return;
      }
      
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = async () => {
    // If we're removing a previously saved logo, delete it from storage
    if (!logoFile && logoPreview && form.getValues().logo_path) {
      const currentLogoPath = form.getValues().logo_path;
      if (currentLogoPath) {
        const deleted = await deleteCompanyLogo(currentLogoPath);
        if (!deleted) {
          toast.error("No se pudo eliminar el logo anterior");
          return;
        }
      }
    }
    
    // Clear the preview and form value
    setLogoFile(null);
    setLogoPreview(null);
    form.setValue("logo_path", "");
  };

  const processSubmit = async (values: z.infer<typeof companyConfigSchema>) => {
    setIsSubmitting(true);
    try {
      // Upload logo if a new one was selected
      if (logoFile) {
        setIsUploading(true);
        
        // Delete previous logo if exists
        if (values.logo_path) {
          await deleteCompanyLogo(values.logo_path);
        }
        
        // Upload new logo
        const logoUrl = await uploadCompanyLogo(logoFile);
        if (logoUrl) {
          values.logo_path = logoUrl;
        }
        setIsUploading(false);
      }
      
      await onSubmit(values as CompanyConfig);
      
      // Clear the file input but keep the preview
      setLogoFile(null);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="razon_social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre o Razón Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre o Razón Social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input placeholder="NIT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input className="pl-10" placeholder="correo@empresa.com" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contacto_principal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Contacto Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="Contacto Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefono_secundario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono Secundario (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono Secundario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="logo_path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo de la Empresa</FormLabel>
              <Card className="border-dashed border-2">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Logo Preview */}
                    {logoPreview && (
                      <div className="relative w-full max-w-md">
                        <img
                          src={logoPreview}
                          alt="Logo de la empresa"
                          className="w-full h-auto max-h-40 object-contain my-2"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={handleRemoveLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Upload Button (show only if no preview) */}
                    {!logoPreview && (
                      <div className="w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Haga clic para cargar</span> o arrastre y suelte
                            </p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 5MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </div>
                    )}
                    
                    <input type="hidden" {...field} />
                  </div>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Configuración
          </Button>
        </div>
      </form>
    </Form>
  );
}
