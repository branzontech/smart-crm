
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cotizacion, Cliente, EmpresaEmisor, Producto } from '@/types/cotizacion';
import { generateCotizacionNumber } from '@/services/cotizacionService';

// Define the shape of our context
type CotizacionContextType = {
  cotizacion: Cotizacion;
  setCotizacion: React.Dispatch<React.SetStateAction<Cotizacion>>;
  currentStep: 'empresa' | 'cliente' | 'productos' | 'preview';
  setCurrentStep: React.Dispatch<React.SetStateAction<'empresa' | 'cliente' | 'productos' | 'preview'>>;
  updateEmpresaEmisor: (empresaEmisor: Partial<EmpresaEmisor>) => void;
  updateCliente: (cliente: Partial<Cliente>) => void;
  updateFechaVencimiento: (date: Date) => void; // Added missing method
  addProducto: (producto: Producto) => void;
  updateProducto: (index: number, producto: Producto) => void;
  removeProducto: (index: number) => void;
  calcularTotales: () => void;
};

// Create the context
const CotizacionContext = createContext<CotizacionContextType | undefined>(undefined);

// Custom hook to use the context
export const useCotizacion = () => {
  const context = useContext(CotizacionContext);
  if (context === undefined) {
    throw new Error('useCotizacion must be used within a CotizacionProvider');
  }
  return context;
};

// Provider component
export const CotizacionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default values
  const [cotizacion, setCotizacion] = useState<Cotizacion>({
    numero: '', // This will be set in useEffect
    fechaEmision: new Date(),
    fechaVencimiento: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
    empresaEmisor: {
      nombre: '',
      nit: '',
      direccion: '',
      telefono: '',
      email: ''
    },
    cliente: {
      nombre: '',
      nit: '',
      direccion: '',
      telefono: '',
      contacto: '',
      email: '',
    },
    productos: [],
    subtotal: 0,
    totalIva: 0,
    total: 0,
    estado: 'borrador'
  });

  const [currentStep, setCurrentStep] = useState<'empresa' | 'cliente' | 'productos' | 'preview'>('empresa');

  // Fetch a new quotation number when the component mounts
  useEffect(() => {
    const fetchCotizacionNumber = async () => {
      try {
        const numero = await generateCotizacionNumber();
        setCotizacion(prev => ({ ...prev, numero }));
      } catch (error) {
        console.error("Error generating quotation number:", error);
      }
    };

    fetchCotizacionNumber();
  }, []);

  // Update empresa emisor data
  const updateEmpresaEmisor = (empresaEmisorData: Partial<EmpresaEmisor>) => {
    setCotizacion(prev => ({ 
      ...prev, 
      empresaEmisor: { ...prev.empresaEmisor, ...empresaEmisorData } 
    }));
  };

  // Update cliente data
  const updateCliente = (clienteData: Partial<Cliente>) => {
    setCotizacion(prev => ({ 
      ...prev, 
      cliente: { ...prev.cliente, ...clienteData } 
    }));
  };

  // Update fecha vencimiento
  const updateFechaVencimiento = (date: Date) => {
    setCotizacion(prev => ({
      ...prev,
      fechaVencimiento: date
    }));
  };

  // Add a new producto
  const addProducto = (producto: Producto) => {
    setCotizacion(prev => {
      const newProductos = [...prev.productos, producto];
      return { ...prev, productos: newProductos };
    });
    calcularTotales();
  };

  // Update an existing producto
  const updateProducto = (index: number, producto: Producto) => {
    setCotizacion(prev => {
      const newProductos = [...prev.productos];
      newProductos[index] = producto;
      return { ...prev, productos: newProductos };
    });
    calcularTotales();
  };

  // Remove a producto
  const removeProducto = (index: number) => {
    setCotizacion(prev => {
      const newProductos = prev.productos.filter((_, i) => i !== index);
      return { ...prev, productos: newProductos };
    });
    calcularTotales();
  };

  // Calculate totals
  const calcularTotales = () => {
    let subtotal = 0;
    let totalIva = 0;

    cotizacion.productos.forEach(producto => {
      subtotal += producto.cantidad * producto.precioUnitario;
      totalIva += (producto.cantidad * producto.precioUnitario * producto.iva) / 100;
    });

    const total = subtotal + totalIva;

    setCotizacion(prev => ({
      ...prev,
      subtotal,
      totalIva,
      total
    }));
  };

  return (
    <CotizacionContext.Provider
      value={{
        cotizacion,
        setCotizacion,
        currentStep,
        setCurrentStep,
        updateEmpresaEmisor,
        updateCliente,
        updateFechaVencimiento,
        addProducto,
        updateProducto,
        removeProducto,
        calcularTotales
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};
