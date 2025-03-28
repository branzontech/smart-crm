
import React, { useState, useEffect } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash, Edit, Save, X, BadgePercent } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox';
import { Producto } from '@/types/cotizacion';

export const ProductosStep: React.FC = () => {
  const { cotizacion, addProducto, updateProducto, removeProducto, calcularTotales } = useCotizacion();
  const { productos, subtotal, totalIva, total } = cotizacion;

  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState<number | null>(null);
  const [precioUnitario, setPrecioUnitario] = useState<number | null>(null);
  const [aplicarIva, setAplicarIva] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productos.length > 0) {
      calcularTotales();
    }
  }, [productos, calcularTotales]);

  const handleAddProducto = () => {
    if (!descripcion) {
      toast.error('La descripción del producto es requerida', {
        position: "top-center"
      });
      return;
    }

    if (!cantidad || cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a cero', {
        position: "top-center"
      });
      return;
    }

    if (!precioUnitario || precioUnitario <= 0) {
      toast.error('El precio unitario debe ser mayor a cero', {
        position: "top-center"
      });
      return;
    }

    setIsSubmitting(true);

    const ivaRate = aplicarIva ? 19 : 0;
    
    const productSubtotal = cantidad * precioUnitario;
    
    const ivaAmount = (productSubtotal * ivaRate) / 100;
    
    const productTotal = productSubtotal + ivaAmount;

    addProducto({
      id: uuidv4(),
      descripcion,
      cantidad,
      precioUnitario,
      iva: ivaRate,
      total: productTotal
    });

    setDescripcion('');
    setCantidad(null);
    setPrecioUnitario(null);

    // Show toast notification with a shorter duration
    toast.success('Producto agregado correctamente', {
      duration: 2000,
      position: "top-center",
    });
    
    // Reset the isSubmitting state after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const startEditingProduct = (productId: string) => {
    const product = productos.find(p => p.id === productId);
    if (product) {
      setDescripcion(product.descripcion);
      setCantidad(product.cantidad);
      setPrecioUnitario(product.precioUnitario);
      setAplicarIva(product.iva > 0);
      setEditingProductId(productId);
    }
  };

  const cancelEditing = () => {
    setDescripcion('');
    setCantidad(null);
    setPrecioUnitario(null);
    setEditingProductId(null);
  };

  const saveEditingProduct = () => {
    if (!editingProductId) return;

    if (!descripcion) {
      toast.error('La descripción del producto es requerida', {
        position: "top-center"
      });
      return;
    }

    if (!cantidad || cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a cero', {
        position: "top-center"
      });
      return;
    }

    if (!precioUnitario || precioUnitario <= 0) {
      toast.error('El precio unitario debe ser mayor a cero', {
        position: "top-center"
      });
      return;
    }

    setIsSubmitting(true);

    const ivaRate = aplicarIva ? 19 : 0;
    
    const productSubtotal = cantidad * precioUnitario;
    
    const ivaAmount = (productSubtotal * ivaRate) / 100;
    
    const productTotal = productSubtotal + ivaAmount;

    const index = productos.findIndex(p => p.id === editingProductId);
    if (index === -1) return;

    updateProducto(index, {
      id: editingProductId,
      descripcion,
      cantidad,
      precioUnitario,
      iva: ivaRate,
      total: productTotal
    });

    setDescripcion('');
    setCantidad(null);
    setPrecioUnitario(null);
    setEditingProductId(null);

    // Show toast notification with a shorter duration
    toast.success('Producto actualizado correctamente', {
      duration: 2000,
      position: "top-center",
    });
    
    // Reset the isSubmitting state after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const handleRemoveProducto = (id: string) => {
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return;
    
    removeProducto(index);
    
    // Show toast notification with a shorter duration
    toast.success('Producto eliminado correctamente', {
      duration: 2000,
      position: "top-center",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-semibold">Productos y Servicios</h2>
      <p className="text-gray-500">
        Agregue los productos o servicios que formarán parte de esta cotización.
      </p>

      <div className="border p-4 rounded-md bg-gray-50">
        <h3 className="font-medium mb-4">
          {editingProductId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto o servicio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              value={cantidad === null ? '' : cantidad}
              onChange={(e) => setCantidad(e.target.value ? Number(e.target.value) : null)}
              placeholder="Ingrese la cantidad"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="precioUnitario">Precio Unitario</Label>
            <Input
              id="precioUnitario"
              type="number"
              min="0"
              value={precioUnitario === null ? '' : precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value ? Number(e.target.value) : null)}
              placeholder="Ingrese el precio unitario"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="aplicarIva" 
              checked={aplicarIva} 
              onCheckedChange={(checked) => setAplicarIva(checked === true)}
            />
            <div className="flex items-center space-x-1.5">
              <Label 
                htmlFor="aplicarIva" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Aplicar IVA (19%)
              </Label>
              <BadgePercent className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="flex items-end">
            {editingProductId ? (
              <div className="flex gap-2">
                <Button
                  onClick={saveEditingProduct}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" /> Guardar
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" /> Cancelar
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddProducto}
                className="bg-primary text-primary-foreground"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar Producto
              </Button>
            )}
          </div>
        </div>
      </div>

      {productos.length > 0 ? (
        <div className="border rounded-md overflow-hidden max-w-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.descripcion}</TableCell>
                    <TableCell className="text-right">{producto.cantidad}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(producto.precioUnitario)}
                    </TableCell>
                    <TableCell className="text-right">{producto.iva}%</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(producto.total)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingProduct(producto.id)}
                          disabled={!!editingProductId || isSubmitting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProducto(producto.id)}
                          disabled={!!editingProductId || isSubmitting}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-end space-y-2">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">IVA:</span>
                  <span>{formatCurrency(totalIva)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <p className="text-gray-500">
            No hay productos agregados a esta cotización.
          </p>
        </div>
      )}
    </div>
  );
};
