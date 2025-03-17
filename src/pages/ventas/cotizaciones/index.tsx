import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Clock, FileText, Filter, Search, ChevronDown, CheckCircle, XCircle, Send } from "lucide-react";
import { getAllCotizaciones } from '@/services/cotizacionService';
import { Cotizacion } from '@/types/cotizacion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout } from "@/components/layout/Layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const CotizacionesPage: React.FC = () => {
  const navigate = useNavigate();
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCotizaciones();
        setCotizaciones(data);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        toast.error("Error al cargar las cotizaciones", {
          position: "top-center"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCotizaciones();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy", { locale: es });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'borrador':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Borrador</span>;
      case 'enviada':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Enviada</span>;
      case 'aprobada':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aprobada</span>;
      case 'rechazada':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rechazada</span>;
      case 'vencida':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Vencida</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrador':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'enviada':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'aprobada':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rechazada':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'vencida':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredCotizaciones = cotizaciones.filter(cotizacion => {
    if (filterStatus && cotizacion.estado !== filterStatus) {
      return false;
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        cotizacion.numero.toLowerCase().includes(query) ||
        cotizacion.cliente.nombre.toLowerCase().includes(query) ||
        cotizacion.cliente.nit.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cotizaciones</h1>
            <p className="text-gray-500 text-sm">Gestione sus cotizaciones para clientes</p>
          </div>
          <Button
            onClick={() => navigate("/ventas/cotizaciones/nueva-cotizacion")}
            className="mt-4 sm:mt-0 bg-[#f15025] hover:bg-[#f15025]/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Cotización
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 items-center">
            <Filter className="text-gray-400 h-5 w-5" />
            <span className="text-sm font-medium text-gray-500">Filtrar por:</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  {filterStatus ? (
                    <span className="flex items-center gap-2">
                      {getStatusIcon(filterStatus)}
                      {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    </span>
                  ) : (
                    'Estado'
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('borrador')}>
                  <FileText className="mr-2 h-4 w-4" /> Borrador
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('enviada')}>
                  <Send className="mr-2 h-4 w-4" /> Enviada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('aprobada')}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Aprobada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('rechazada')}>
                  <XCircle className="mr-2 h-4 w-4" /> Rechazada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('vencida')}>
                  <Clock className="mr-2 h-4 w-4" /> Vencida
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f15025] focus:border-transparent"
              placeholder="Buscar por número, cliente o NIT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f15025]"></div>
          </div>
        ) : filteredCotizaciones.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCotizaciones.map((cotizacion) => (
                    <tr key={cotizacion.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cotizacion.numero}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cotizacion.cliente.nombre}</div>
                        <div className="text-xs text-gray-500">NIT: {cotizacion.cliente.nit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(cotizacion.fechaEmision)}</div>
                        <div className="text-xs text-gray-500">Vence: {formatDate(cotizacion.fechaVencimiento)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#2d1e2f]">{formatCurrency(cotizacion.total)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(cotizacion.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/ventas/cotizaciones/${cotizacion.id}`)}
                          className="text-[#f15025] hover:text-[#f15025]/80 hover:bg-[#f15025]/10"
                        >
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay cotizaciones</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus
                ? "No se encontraron cotizaciones con los filtros aplicados."
                : "Aún no ha creado ninguna cotización."}
            </p>
            {searchQuery || filterStatus ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus(null);
                }}
              >
                Limpiar filtros
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/ventas/cotizaciones/nueva-cotizacion")}
                className="bg-[#f15025] hover:bg-[#f15025]/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Crear cotización
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CotizacionesPage;
