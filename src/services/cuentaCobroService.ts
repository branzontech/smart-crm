
import { CuentaCobro, CuentaCobroFormData } from "@/types/cuentacobro";
import { v4 as uuidv4 } from "uuid";

// Datos de ejemplo para las cuentas de cobro
const CUENTAS_COBRO_MOCK: CuentaCobro[] = [
  {
    id: "cc-001",
    formato: "F-CUE-CO-001",
    version: "001",
    fechaActualizacion: "29-10-2024",
    fechaEmision: "30-12-2024",
    emisor: {
      nombre: "GEOVANNY J. RODRIGUEZ CARRILLO",
      ciudad: "Cartagena",
      telefono: "311-6918559",
      email: "giovanijoserodriguezcarrillo@gmail.com",
    },
    receptor: {
      empresa: "Branzon Tech S.A.S.",
      direccion: "Conj Guanabara cll 32 80624 to 8 apto 1004 Brr Villa Estrella",
      ciudad: "Cartagena de Indias",
    },
    periodo: {
      desde: "Octubre 01",
      hasta: "Diciembre 30",
    },
    servicio: {
      descripcion: "Desarrollo de Requerimientos COMPAS",
      fase: "Fase 2",
      ordenCompra: "No. 13067",
    },
    valor: {
      monto: 3200000,
      montoTexto: "tres millones doscientos pesos M/CTE",
    },
    datosPago: {
      banco: "Bancolombia",
      tipoCuenta: "Ahorro a la Mano",
      numeroCuenta: "031-169185-59",
      titular: "Geovanny J. Rodríguez Carrillo CC 1.007.170.464 de Cartagena",
    },
    estado: "pendiente",
  },
  {
    id: "cc-002",
    formato: "F-CUE-CO-001",
    version: "001",
    fechaActualizacion: "29-10-2024",
    fechaEmision: "15-01-2025",
    emisor: {
      nombre: "GEOVANNY J. RODRIGUEZ CARRILLO",
      ciudad: "Cartagena",
      telefono: "311-6918559",
      email: "giovanijoserodriguezcarrillo@gmail.com",
    },
    receptor: {
      empresa: "Desarrollo Tecnológico S.A.",
      direccion: "Calle Principal #45-23",
      ciudad: "Bogotá",
    },
    periodo: {
      desde: "Enero 01",
      hasta: "Enero 15",
    },
    servicio: {
      descripcion: "Servicio de mantenimiento web",
      ordenCompra: "No. 45678",
    },
    valor: {
      monto: 1800000,
      montoTexto: "un millón ochocientos mil pesos M/CTE",
    },
    datosPago: {
      banco: "Bancolombia",
      tipoCuenta: "Ahorro a la Mano",
      numeroCuenta: "031-169185-59",
      titular: "Geovanny J. Rodríguez Carrillo CC 1.007.170.464 de Cartagena",
    },
    estado: "pagada",
  },
];

class CuentaCobroService {
  private cuentasCobro: CuentaCobro[] = CUENTAS_COBRO_MOCK;

  // Obtener todas las cuentas de cobro
  getAll(): CuentaCobro[] {
    return this.cuentasCobro;
  }

  // Obtener una cuenta de cobro por ID
  getById(id: string): CuentaCobro | undefined {
    return this.cuentasCobro.find((cuenta) => cuenta.id === id);
  }

  // Crear una nueva cuenta de cobro
  create(data: CuentaCobroFormData): CuentaCobro {
    const numberFormat = new Intl.NumberFormat('es-CO');
    
    // Convertir número a texto
    const montoTexto = this.convertirNumeroALetras(data.valor.monto);
    
    const nuevaCuenta: CuentaCobro = {
      id: `cc-${uuidv4().slice(0, 8)}`,
      formato: "F-CUE-CO-001",
      version: "001",
      fechaActualizacion: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-'),
      fechaEmision: data.fechaEmision,
      emisor: data.emisor,
      receptor: data.receptor,
      periodo: data.periodo,
      servicio: data.servicio,
      valor: {
        monto: data.valor.monto,
        montoTexto: montoTexto,
      },
      datosPago: data.datosPago,
      estado: "pendiente",
      fechaVencimiento: data.fechaVencimiento,
      notas: data.notas,
    };

    this.cuentasCobro.push(nuevaCuenta);
    return nuevaCuenta;
  }

  // Actualizar estado de una cuenta de cobro
  updateStatus(id: string, estado: CuentaCobro['estado']): CuentaCobro | undefined {
    const cuenta = this.getById(id);
    if (cuenta) {
      cuenta.estado = estado;
      return cuenta;
    }
    return undefined;
  }

  // Eliminar una cuenta de cobro
  delete(id: string): boolean {
    const initialLength = this.cuentasCobro.length;
    this.cuentasCobro = this.cuentasCobro.filter((cuenta) => cuenta.id !== id);
    return initialLength > this.cuentasCobro.length;
  }

  // Buscar cuentas de cobro
  search(query: string): CuentaCobro[] {
    query = query.toLowerCase();
    return this.cuentasCobro.filter((cuenta) => 
      cuenta.emisor.nombre.toLowerCase().includes(query) ||
      cuenta.receptor.empresa.toLowerCase().includes(query) ||
      cuenta.servicio.descripcion.toLowerCase().includes(query) ||
      cuenta.id.toLowerCase().includes(query)
    );
  }

  // Filtrar cuentas de cobro por estado
  filterByStatus(estado: CuentaCobro['estado']): CuentaCobro[] {
    return this.cuentasCobro.filter((cuenta) => cuenta.estado === estado);
  }

  // Método auxiliar para convertir números a letras (simplificado)
  private convertirNumeroALetras(numero: number): string {
    // Simplificación - en un caso real se usaría una librería más completa
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    const numeroFormateado = formatter.format(numero)
      .replace('COP', '')
      .trim();
    
    // Mapeo simplificado de números a letras
    const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
    if (numero < 1000000) {
      return `${numeroFormateado} pesos M/CTE`;
    } else if (numero < 2000000) {
      return `un millón ${numeroFormateado.replace('1.000.000', '')} pesos M/CTE`.trim();
    } else if (numero < 1000000000) {
      const millones = Math.floor(numero / 1000000);
      return `${unidades[millones]} millones ${numeroFormateado.replace(/\d+\.\d{3}\./, '')} pesos M/CTE`.trim();
    }
    
    return `${numeroFormateado} pesos M/CTE`;
  }
}

// Exportar una instancia única del servicio (Singleton)
export const cuentaCobroService = new CuentaCobroService();
