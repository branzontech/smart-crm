
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NuevoArticuloForm, Articulo } from "./NuevoArticuloForm";
import { ArticulosTable } from "./ArticulosTable";
import { FileUpload } from "@/components/FileUpload";
import { RecaudoSummary } from "./RecaudoSummary";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";

interface ArticulosSectionProps {
  articulos: Articulo[];
  setArticulos: (articulos: Articulo[]) => void;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  onFilesChange: (files: File[]) => void;
}

export function ArticulosSection({
  articulos,
  setArticulos,
  watch,
  setValue,
  onFilesChange
}: ArticulosSectionProps) {
  const [proveedorQuery, setProveedorQuery] = useState("");
  const [nuevoArticulo, setNuevoArticulo] = useState<{
    proveedor_id: string;
    nombreProveedor: string;
    descripcion: string;
    cantidad: number | null;
    valor_unitario: number | null;
    tasa_iva: number;
  }>({
    proveedor_id: "",
    nombreProveedor: "",
    descripcion: "",
    cantidad: null,
    valor_unitario: null,
    tasa_iva: 0,
  });

  const calcularTotales = () => {
    const subtotal = articulos.reduce((sum, item) => sum + (item.valor_total || 0), 0);
    const iva = articulos.reduce((sum, item) => sum + (item.valor_iva || 0), 0);
    const total = subtotal + iva;
    
    setValue('subtotal', subtotal);
    setValue('iva', iva);
    setValue('total', total);
    setValue('monto', total.toString());
  };

  const agregarArticulo = () => {
    if (!nuevoArticulo.proveedor_id || !nuevoArticulo.descripcion) {
      toast.error("El proveedor y la descripción son requeridos");
      return;
    }
    
    if (nuevoArticulo.cantidad === null) {
      toast.error("La cantidad es requerida");
      return;
    }
    
    if (nuevoArticulo.valor_unitario === null) {
      toast.error("El valor unitario es requerido");
      return;
    }
    
    const valorTotal = nuevoArticulo.cantidad * nuevoArticulo.valor_unitario;
    const valorIva = valorTotal * nuevoArticulo.tasa_iva;
    
    const articulo: Articulo = {
      id: `art-${Date.now()}`,
      proveedor_id: nuevoArticulo.proveedor_id,
      nombreProveedor: nuevoArticulo.nombreProveedor,
      descripcion: nuevoArticulo.descripcion,
      cantidad: nuevoArticulo.cantidad,
      valor_unitario: nuevoArticulo.valor_unitario,
      valor_total: valorTotal,
      tasa_iva: nuevoArticulo.tasa_iva,
      valor_iva: valorIva,
    };
    
    const nuevosArticulos = [...articulos, articulo];
    setArticulos(nuevosArticulos);
    
    setNuevoArticulo({
      proveedor_id: "",
      nombreProveedor: "",
      descripcion: "",
      cantidad: null,
      valor_unitario: null,
      tasa_iva: 0,
    });
    
    setProveedorQuery("");
    
    setTimeout(() => calcularTotales(), 0);
  };

  const eliminarArticulo = (id: string) => {
    const nuevosArticulos = articulos.filter(articulo => articulo.id !== id);
    setArticulos(nuevosArticulos);
    setTimeout(() => calcularTotales(), 0);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Artículos o Servicios por Proveedor</CardTitle>
      </CardHeader>
      <CardContent>
        <NuevoArticuloForm
          nuevoArticulo={nuevoArticulo}
          setNuevoArticulo={setNuevoArticulo}
          agregarArticulo={agregarArticulo}
          proveedorQuery={proveedorQuery}
          setProveedorQuery={setProveedorQuery}
        />
        
        <ArticulosTable 
          articulos={articulos} 
          eliminarArticulo={eliminarArticulo} 
        />
        
        <FileUpload onFilesChange={onFilesChange} />
        
        <RecaudoSummary watch={watch} />
      </CardContent>
    </Card>
  );
}
