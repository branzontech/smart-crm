import React, { useState } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash, Edit, Save, X, BadgePercent } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox';

export const ProductosStep: React.FC = () => {
  const { cotizacion, addProducto, updateProducto, removeProducto } = useCotizacion();
  const { productos, subtotal, totalIva, total } = cotizacion;

  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [iva, setIva] = useState(19); // Default IVA rate in Colombia
  const [aplicarIva, setAplicarIva] = useState(true); // State for the checkbox
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleAddProducto = () => {
    if (!descripcion) {
      toast.error('La descripción del producto es requerida');
      return;
    }

    if (cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a cero');
      return;
    }

    if (precioUnitario <= 0) {
      toast.error('El precio unitario debe ser mayor a cero');
      return;
    }

    addProducto({
      id: uuidv4(),
      descripcion,
      cantidad,
      precioUnitario,
      iva: aplicarIva ? iva : 0
    });

    // Reset form
    setDescripcion('');
    setCantidad(1);
    setPrecioUnitario(0);
    setIva(19);
    // Keep aplicarIva checkbox as is for user convenience

    toast.success('Producto agregado correctamente');
  };

  const startEditingProduct = (productId: string) => {
    const product = productos.find(p => p.id === productId);
    if (product) {
      setDescripcion(product.descripcion);
      setCantidad(product.cantidad);
      setPrecioUnitario(product.precioUnitario);
      setIva(product.iva);
      setEditingProductId(productId);
    }
  };

  const cancelEditing = () => {
    setDescripcion('');
    setCantidad(1);
    setPrecioUnitario(0);
    setIva(19);
    setEditingProductId(null);
  };

  const saveEditingProduct = () => {
    if (!editingProductId) return;

    if (!descripcion) {
      toast.error('La descripción del producto es requerida');
      return;
    }

    if (cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a cero');
      return;
    }

    if (precioUnitario <= 0) {
      toast.error('El precio unitario debe ser mayor a cero');
      return;
    }

    updateProducto(editingProductId, {
      descripcion,
      cantidad,
      precioUnitario,
      iva: aplicarIva ? iva : 0
    });

    // Reset form
    setDescripcion('');
    setCantidad(1);
    setPrecioUnitario(0);
    setIva(19);
    setEditingProductId(null);

    toast.success('Producto actualizado correctamente');
  };

  const handleRemoveProducto = (id: string) => {
    removeProducto(id);
    toast.success('Producto eliminado correctamente');
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
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="precioUnitario">Precio Unitario</Label>
            <Input
              id="precioUnitario"
              type="number"
              min="0"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="iva" className={!aplicarIva ? "text-gray-400" : ""}>IVA (%)</Label>
              <Input
                id="iva"
                type="number"
                min="0"
                max="100"
                value={iva}
                onChange={(e) => setIva(Number(e.target.value))}
                disabled={!aplicarIva}
                className={!aplicarIva ? "bg-gray-100 text-gray-400" : ""}
              />
            </div>
          </div>

          <div className="flex items-start md:items-center gap-2">
            <div className="flex items-center space-x-2 mt-2">
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
          </div>

          <div className="flex items-end">
            {editingProductId ? (
              <div className="flex gap-2">
                <Button
                  onClick={saveEditingProduct}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" /> Guardar
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEditing}
                >
                  <X className="h-4 w-4 mr-2" /> Cancelar
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddProducto}
                className="bg-primary text-primary-foreground"
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
                          disabled={!!editingProductId}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProducto(producto.id)}
                          disabled={!!editingProductId}
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
