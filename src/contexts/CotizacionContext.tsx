
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cotizacion, CotizacionStep, ProductoCotizacion, Cliente, EmpresaEmisor } from '@/types/cotizacion';
import { generateCotizacionNumber } from '@/services/cotizacionService';

interface CotizacionContextType {
  cotizacion: Cotizacion;
  currentStep: CotizacionStep;
  setCurrentStep: (step: CotizacionStep) => void;
  updateEmpresaEmisor: (empresa: Partial<EmpresaEmisor>) => void;
  updateCliente: (cliente: Partial<Cliente>) => void;
  addProducto: (producto: Omit<ProductoCotizacion, 'total'>) => void;
  updateProducto: (id: string, updates: Partial<Omit<ProductoCotizacion, 'total'>>) => void;
  removeProducto: (id: string) => void;
  updateFechaVencimiento: (fecha: Date) => void;
  resetCotizacion: () => void;
  calcularTotales: () => void;
}

const defaultEmpresa: EmpresaEmisor = {
  nombre: '',
  nit: '',
  telefono: '',
  direccion: '',
};

const defaultCliente: Cliente = {
  nombre: '',
  nit: '',
  telefono: '',
  contacto: '',
  direccion: '',
  pais_id: '',
  ciudad_id: '',
  sector_id: ''
};

const createDefaultCotizacion = (): Cotizacion => {
  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  return {
    numero: generateCotizacionNumber(),
    fechaEmision: today,
    fechaVencimiento: thirtyDaysLater,
    empresaEmisor: defaultEmpresa,
    cliente: defaultCliente,
    productos: [],
    subtotal: 0,
    totalIva: 0,
    total: 0,
    estado: 'borrador'
  };
};

const CotizacionContext = createContext<CotizacionContextType | undefined>(undefined);

export const CotizacionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cotizacion, setCotizacion] = useState<Cotizacion>(createDefaultCotizacion());
  const [currentStep, setCurrentStep] = useState<CotizacionStep>('empresa');

  // Usamos useCallback para evitar recreaciones innecesarias de las funciones
  const updateEmpresaEmisor = useCallback((empresa: Partial<EmpresaEmisor>) => {
    setCotizacion(prev => ({
      ...prev,
      empresaEmisor: { ...prev.empresaEmisor, ...empresa }
    }));
  }, []);

  const updateCliente = useCallback((cliente: Partial<Cliente>) => {
    setCotizacion(prev => ({
      ...prev,
      cliente: { ...prev.cliente, ...cliente }
    }));
  }, []);

  const calcularTotalProducto = (
    cantidad: number,
    precioUnitario: number,
    iva: number
  ): number => {
    const subtotal = cantidad * precioUnitario;
    const ivaAmount = subtotal * (iva / 100);
    return subtotal + ivaAmount;
  };

  const addProducto = useCallback((producto: Omit<ProductoCotizacion, 'total'>) => {
    const total = calcularTotalProducto(
      producto.cantidad,
      producto.precioUnitario,
      producto.iva
    );
    
    const newProducto: ProductoCotizacion = {
      ...producto,
      total,
    };
    
    setCotizacion(prev => ({
      ...prev,
      productos: [...prev.productos, newProducto]
    }));
  }, []);

  const updateProducto = useCallback((
    id: string,
    updates: Partial<Omit<ProductoCotizacion, 'total'>>
  ) => {
    setCotizacion(prev => {
      const updatedProductos = prev.productos.map(p => {
        if (p.id === id) {
          const updatedProduct = { ...p, ...updates };
          updatedProduct.total = calcularTotalProducto(
            updatedProduct.cantidad,
            updatedProduct.precioUnitario,
            updatedProduct.iva
          );
          return updatedProduct;
        }
        return p;
      });

      return {
        ...prev,
        productos: updatedProductos
      };
    });
  }, []);

  const removeProducto = useCallback((id: string) => {
    setCotizacion(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== id)
    }));
  }, []);

  const updateFechaVencimiento = useCallback((fecha: Date) => {
    setCotizacion(prev => ({
      ...prev,
      fechaVencimiento: fecha
    }));
  }, []);

  const calcularTotales = useCallback(() => {
    setCotizacion(prev => {
      const subtotal = prev.productos.reduce(
        (sum, product) => sum + (product.cantidad * product.precioUnitario),
        0
      );
      
      const totalIva = prev.productos.reduce(
        (sum, product) => 
          sum + (product.cantidad * product.precioUnitario * (product.iva / 100)),
        0
      );
      
      return {
        ...prev,
        subtotal,
        totalIva,
        total: subtotal + totalIva
      };
    });
  }, []);

  const resetCotizacion = useCallback(() => {
    setCotizacion(createDefaultCotizacion());
    setCurrentStep('empresa');
  }, []);

  useEffect(() => {
    calcularTotales();
  }, [cotizacion.productos, calcularTotales]);

  const value: CotizacionContextType = {
    cotizacion,
    currentStep,
    setCurrentStep,
    updateEmpresaEmisor,
    updateCliente,
    addProducto,
    updateProducto,
    removeProducto,
    updateFechaVencimiento,
    resetCotizacion,
    calcularTotales
  };

  return (
    <CotizacionContext.Provider value={value}>
      {children}
    </CotizacionContext.Provider>
  );
};

export const useCotizacion = (): CotizacionContextType => {
  const context = useContext(CotizacionContext);
  if (context === undefined) {
    throw new Error('useCotizacion must be used within a CotizacionProvider');
  }
  return context;
};
