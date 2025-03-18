export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      archivos_recaudo: {
        Row: {
          created_at: string
          id: string
          nombre: string
          path: string
          recaudo_id: string
          tamano: number
          tipo: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          path: string
          recaudo_id: string
          tamano: number
          tipo: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          path?: string
          recaudo_id?: string
          tamano?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "archivos_recaudo_recaudo_id_fkey"
            columns: ["recaudo_id"]
            isOneToOne: false
            referencedRelation: "recaudos"
            referencedColumns: ["id"]
          },
        ]
      }
      articulos_recaudo: {
        Row: {
          cantidad: number
          created_at: string
          descripcion: string
          id: string
          proveedor_id: string
          recaudo_id: string
          tasa_iva: number
          updated_at: string
          valor_iva: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          cantidad: number
          created_at?: string
          descripcion: string
          id?: string
          proveedor_id: string
          recaudo_id: string
          tasa_iva: number
          updated_at?: string
          valor_iva: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          cantidad?: number
          created_at?: string
          descripcion?: string
          id?: string
          proveedor_id?: string
          recaudo_id?: string
          tasa_iva?: number
          updated_at?: string
          valor_iva?: number
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "articulos_recaudo_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articulos_recaudo_recaudo_id_fkey"
            columns: ["recaudo_id"]
            isOneToOne: false
            referencedRelation: "recaudos"
            referencedColumns: ["id"]
          },
        ]
      }
      ciudades: {
        Row: {
          created_at: string
          id: string
          nombre: string
          pais_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          pais_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          pais_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ciudades_pais_id_fkey"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "paises"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          apellidos: string | null
          cargo: string | null
          ciudad_id: string | null
          created_at: string
          direccion: string
          documento: string
          email: string
          empresa: string | null
          id: string
          nombre: string
          notas: string | null
          origen_id: string | null
          pais_id: string | null
          presupuesto_estimado: number | null
          sector_id: string | null
          telefono: string
          tipo: string
          tipo_documento: string
          tipo_persona: string
          tipo_servicio_id: string | null
          updated_at: string
        }
        Insert: {
          apellidos?: string | null
          cargo?: string | null
          ciudad_id?: string | null
          created_at?: string
          direccion: string
          documento: string
          email: string
          empresa?: string | null
          id?: string
          nombre: string
          notas?: string | null
          origen_id?: string | null
          pais_id?: string | null
          presupuesto_estimado?: number | null
          sector_id?: string | null
          telefono: string
          tipo: string
          tipo_documento: string
          tipo_persona: string
          tipo_servicio_id?: string | null
          updated_at?: string
        }
        Update: {
          apellidos?: string | null
          cargo?: string | null
          ciudad_id?: string | null
          created_at?: string
          direccion?: string
          documento?: string
          email?: string
          empresa?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          origen_id?: string | null
          pais_id?: string | null
          presupuesto_estimado?: number | null
          sector_id?: string | null
          telefono?: string
          tipo?: string
          tipo_documento?: string
          tipo_persona?: string
          tipo_servicio_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_ciudad_id_fkey"
            columns: ["ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_origen_id_fkey"
            columns: ["origen_id"]
            isOneToOne: false
            referencedRelation: "origenes_cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_pais_id_fkey"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "paises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_tipo_servicio_id_fkey"
            columns: ["tipo_servicio_id"]
            isOneToOne: false
            referencedRelation: "tipos_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      config_empresas: {
        Row: {
          contacto_principal: string
          created_at: string
          direccion: string
          email: string | null
          id: string
          logo_path: string | null
          nit: string
          razon_social: string
          telefono: string
          telefono_secundario: string | null
          updated_at: string
        }
        Insert: {
          contacto_principal: string
          created_at?: string
          direccion: string
          email?: string | null
          id?: string
          logo_path?: string | null
          nit: string
          razon_social: string
          telefono: string
          telefono_secundario?: string | null
          updated_at?: string
        }
        Update: {
          contacto_principal?: string
          created_at?: string
          direccion?: string
          email?: string | null
          id?: string
          logo_path?: string | null
          nit?: string
          razon_social?: string
          telefono?: string
          telefono_secundario?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cotizaciones: {
        Row: {
          cliente: Json
          created_at: string
          empresa_emisor: Json
          estado: string
          fecha_emision: string
          fecha_vencimiento: string
          firma_nombre: string | null
          firma_url: string | null
          id: string
          numero: string
          subtotal: number
          total: number
          total_iva: number
          updated_at: string
        }
        Insert: {
          cliente: Json
          created_at?: string
          empresa_emisor: Json
          estado?: string
          fecha_emision: string
          fecha_vencimiento: string
          firma_nombre?: string | null
          firma_url?: string | null
          id?: string
          numero: string
          subtotal?: number
          total?: number
          total_iva?: number
          updated_at?: string
        }
        Update: {
          cliente?: Json
          created_at?: string
          empresa_emisor?: Json
          estado?: string
          fecha_emision?: string
          fecha_vencimiento?: string
          firma_nombre?: string | null
          firma_url?: string | null
          id?: string
          numero?: string
          subtotal?: number
          total?: number
          total_iva?: number
          updated_at?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          ciudad: string
          created_at: string
          descripcion: string | null
          direccion: string
          empleados: number
          id: string
          industria: string
          nombre: string
          periodo_vencimiento_facturas: string
          sitio_web: string | null
          telefono: string
          updated_at: string
        }
        Insert: {
          ciudad: string
          created_at?: string
          descripcion?: string | null
          direccion: string
          empleados: number
          id?: string
          industria: string
          nombre: string
          periodo_vencimiento_facturas: string
          sitio_web?: string | null
          telefono: string
          updated_at?: string
        }
        Update: {
          ciudad?: string
          created_at?: string
          descripcion?: string | null
          direccion?: string
          empleados?: number
          id?: string
          industria?: string
          nombre?: string
          periodo_vencimiento_facturas?: string
          sitio_web?: string | null
          telefono?: string
          updated_at?: string
        }
        Relationships: []
      }
      oportunidades: {
        Row: {
          cliente: string
          created_at: string
          descripcion: string | null
          etapa: string
          fecha_cierre: string
          id: string
          probabilidad: number
          updated_at: string
          valor: number
        }
        Insert: {
          cliente: string
          created_at?: string
          descripcion?: string | null
          etapa: string
          fecha_cierre: string
          id?: string
          probabilidad: number
          updated_at?: string
          valor: number
        }
        Update: {
          cliente?: string
          created_at?: string
          descripcion?: string | null
          etapa?: string
          fecha_cierre?: string
          id?: string
          probabilidad?: number
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      origenes_cliente: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      paises: {
        Row: {
          codigo: number | null
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          codigo?: number | null
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          codigo?: number | null
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      productos_cotizacion: {
        Row: {
          cantidad: number
          cotizacion_id: string
          created_at: string
          descripcion: string
          id: string
          iva: number
          precio_unitario: number
          total: number
          updated_at: string
        }
        Insert: {
          cantidad: number
          cotizacion_id: string
          created_at?: string
          descripcion: string
          id?: string
          iva?: number
          precio_unitario: number
          total: number
          updated_at?: string
        }
        Update: {
          cantidad?: number
          cotizacion_id?: string
          created_at?: string
          descripcion?: string
          id?: string
          iva?: number
          precio_unitario?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_cotizacion_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apellido: string | null
          created_at: string
          email: string
          id: string
          nombre: string | null
          rol: string
          rol_usuario: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          apellido?: string | null
          created_at?: string
          email: string
          id: string
          nombre?: string | null
          rol?: string
          rol_usuario?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          apellido?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre?: string | null
          rol?: string
          rol_usuario?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      proveedores: {
        Row: {
          contacto: string
          created_at: string
          descripcion: string | null
          documento: string
          id: string
          nombre: string
          sector_id: string | null
          tipo_documento: string
          tipo_proveedor: string
          updated_at: string
        }
        Insert: {
          contacto: string
          created_at?: string
          descripcion?: string | null
          documento: string
          id?: string
          nombre: string
          sector_id?: string | null
          tipo_documento: string
          tipo_proveedor: string
          updated_at?: string
        }
        Update: {
          contacto?: string
          created_at?: string
          descripcion?: string | null
          documento?: string
          id?: string
          nombre?: string
          sector_id?: string | null
          tipo_documento?: string
          tipo_proveedor?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proveedores_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectores"
            referencedColumns: ["id"]
          },
        ]
      }
      recaudos: {
        Row: {
          cliente_id: string
          created_at: string
          estado: string
          fecha_pago: string
          fecha_vencimiento: string
          id: string
          iva: number
          metodo_pago: string
          monto: number
          notas: string | null
          numero: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          estado: string
          fecha_pago: string
          fecha_vencimiento: string
          id?: string
          iva: number
          metodo_pago: string
          monto: number
          notas?: string | null
          numero: string
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          estado?: string
          fecha_pago?: string
          fecha_vencimiento?: string
          id?: string
          iva?: number
          metodo_pago?: string
          monto?: number
          notas?: string | null
          numero?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recaudos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      sectores: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      tipos_productos: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      tipos_servicios: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      crear_recaudo: {
        Args: {
          p_cliente_id: string
          p_monto: number
          p_subtotal: number
          p_iva: number
          p_total: number
          p_metodo_pago: string
          p_fecha_pago: string
          p_fecha_vencimiento: string
          p_estado: string
          p_notas: string
        }
        Returns: string
      }
      get_next_cotizacion_numero: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_next_recaudo_numero: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role:
        | "Administrador"
        | "Agente"
        | "Contratista"
        | "Pagador"
        | "Financiero"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
