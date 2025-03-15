
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getSectores } from "@/services/maestros/sectorService";
import { useEffect } from "react";

interface EmbeddedProveedorFormProps {
  onProveedorCreated: (proveedor: any) => void;
  onCancel?: () => void;
}

export function EmbeddedProveedorForm({ onProveedorCreated, onCancel }: EmbeddedProveedorFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo_documento: "nit",
    documento: "",
    contacto: "",
    tipo_proveedor: "productos",
    sector_id: "",
    descripcion: "",
  });
  const [sectores, setSectores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const { data } = await getSectores();
        if (data) {
          setSectores(data);
        }
      } catch (error) {
        console.error("Error fetching sectores:", error);
      }
    };

    fetchSectores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate required fields
    if (!formData.nombre || !formData.documento) {
      setIsLoading(false);
      return;
    }

    onProveedorCreated(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            placeholder="Nombre del proveedor"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_documento">Tipo Documento</Label>
            <Select 
              value={formData.tipo_documento} 
              onValueChange={(value) => handleSelectChange("tipo_documento", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nit">NIT</SelectItem>
                <SelectItem value="cc">Cédula</SelectItem>
                <SelectItem value="ce">Cédula Extranjería</SelectItem>
                <SelectItem value="pasaporte">Pasaporte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documento">Documento *</Label>
            <Input
              id="documento"
              placeholder="Número de documento"
              value={formData.documento}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contacto">Contacto</Label>
          <Input
            id="contacto"
            placeholder="Número de contacto"
            value={formData.contacto}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_proveedor">Tipo de Proveedor</Label>
            <Select 
              value={formData.tipo_proveedor} 
              onValueChange={(value) => handleSelectChange("tipo_proveedor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="productos">Productos</SelectItem>
                <SelectItem value="servicios">Servicios</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector_id">Sector</Label>
            <Select 
              value={formData.sector_id} 
              onValueChange={(value) => handleSelectChange("sector_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sector" />
              </SelectTrigger>
              <SelectContent>
                {sectores.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Input
            id="descripcion"
            placeholder="Descripción del proveedor"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          className="bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 text-teal"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar Proveedor"}
        </Button>
      </div>
    </form>
  );
}
