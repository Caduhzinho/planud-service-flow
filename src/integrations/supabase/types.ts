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
      agendamentos: {
        Row: {
          cliente_id: string
          created_at: string
          data_hora: string
          empresa_id: string
          id: string
          observacao: string | null
          servico: string
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_hora: string
          empresa_id: string
          id?: string
          observacao?: string | null
          servico: string
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_hora?: string
          empresa_id?: string
          id?: string
          observacao?: string | null
          servico?: string
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas: {
        Row: {
          ativa: boolean | null
          criada_em: string | null
          empresa_id: string | null
          forma_pagamento: string | null
          id: string
          id_asaas: string | null
          link_pagamento: string | null
          plano_id: string | null
          status: string | null
          updated_at: string | null
          vencimento: string | null
        }
        Insert: {
          ativa?: boolean | null
          criada_em?: string | null
          empresa_id?: string | null
          forma_pagamento?: string | null
          id?: string
          id_asaas?: string | null
          link_pagamento?: string | null
          plano_id?: string | null
          status?: string | null
          updated_at?: string | null
          vencimento?: string | null
        }
        Update: {
          ativa?: boolean | null
          criada_em?: string | null
          empresa_id?: string | null
          forma_pagamento?: string | null
          id?: string
          id_asaas?: string | null
          link_pagamento?: string | null
          plano_id?: string | null
          status?: string | null
          updated_at?: string | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          email: string | null
          empresa_id: string
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          empresa_id: string
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          criado_em: string | null
          empresa_id: string | null
          enviar_whatsapp_automatico: boolean | null
          gerar_nota_automatica: boolean | null
          id: string
          logo_url: string | null
          notificacoes_email: boolean | null
          notificacoes_push: boolean | null
          plano_ativo: string | null
          tema_visual: string | null
          updated_at: string | null
        }
        Insert: {
          criado_em?: string | null
          empresa_id?: string | null
          enviar_whatsapp_automatico?: boolean | null
          gerar_nota_automatica?: boolean | null
          id?: string
          logo_url?: string | null
          notificacoes_email?: boolean | null
          notificacoes_push?: boolean | null
          plano_ativo?: string | null
          tema_visual?: string | null
          updated_at?: string | null
        }
        Update: {
          criado_em?: string | null
          empresa_id?: string | null
          enviar_whatsapp_automatico?: boolean | null
          gerar_nota_automatica?: boolean | null
          id?: string
          logo_url?: string | null
          notificacoes_email?: boolean | null
          notificacoes_push?: boolean | null
          plano_ativo?: string | null
          tema_visual?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          aceita_privacidade: boolean | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          data_aceite_privacidade: string | null
          endereco: string | null
          id: string
          logo_url: string | null
          nome: string
          plano: string
          plano_id: string | null
          ramo: string
          updated_at: string
        }
        Insert: {
          aceita_privacidade?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          data_aceite_privacidade?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          plano: string
          plano_id?: string | null
          ramo: string
          updated_at?: string
        }
        Update: {
          aceita_privacidade?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          data_aceite_privacidade?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          plano?: string
          plano_id?: string | null
          ramo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          categoria: string | null
          criado_em: string | null
          data_lancamento: string | null
          descricao: string | null
          empresa_id: string
          id: string
          observacoes: string | null
          origem: string | null
          pago: boolean | null
          recorrente: boolean | null
          tipo: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          categoria?: string | null
          criado_em?: string | null
          data_lancamento?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          observacoes?: string | null
          origem?: string | null
          pago?: boolean | null
          recorrente?: boolean | null
          tipo: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          categoria?: string | null
          criado_em?: string | null
          data_lancamento?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          observacoes?: string | null
          origem?: string | null
          pago?: boolean | null
          recorrente?: boolean | null
          tipo?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_fiscais: {
        Row: {
          agendamento_id: string | null
          cliente_id: string
          codigo_nf: string | null
          criada_em: string | null
          data_emissao: string | null
          empresa_id: string
          enviada: boolean | null
          forma_pagamento: string | null
          id: string
          link_pagamento: string | null
          pdf_url: string | null
          status: string | null
          updated_at: string | null
          valor: number
        }
        Insert: {
          agendamento_id?: string | null
          cliente_id: string
          codigo_nf?: string | null
          criada_em?: string | null
          data_emissao?: string | null
          empresa_id: string
          enviada?: boolean | null
          forma_pagamento?: string | null
          id?: string
          link_pagamento?: string | null
          pdf_url?: string | null
          status?: string | null
          updated_at?: string | null
          valor: number
        }
        Update: {
          agendamento_id?: string | null
          cliente_id?: string
          codigo_nf?: string | null
          criada_em?: string | null
          data_emissao?: string | null
          empresa_id?: string
          enviada?: boolean | null
          forma_pagamento?: string | null
          id?: string
          link_pagamento?: string | null
          pdf_url?: string | null
          status?: string | null
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          criado_em: string | null
          descricao: string | null
          id: string
          limite_agendamentos: number | null
          limite_notas: number | null
          nome: string
          permite_ia: boolean | null
          permite_logo: boolean | null
          preco_mensal: number | null
          suporte_whatsapp: boolean | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          limite_agendamentos?: number | null
          limite_notas?: number | null
          nome: string
          permite_ia?: boolean | null
          permite_logo?: boolean | null
          preco_mensal?: number | null
          suporte_whatsapp?: boolean | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          limite_agendamentos?: number | null
          limite_notas?: number | null
          nome?: string
          permite_ia?: boolean | null
          permite_logo?: boolean | null
          preco_mensal?: number | null
          suporte_whatsapp?: boolean | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          aceitou_privacidade: boolean | null
          aceitou_termos: boolean | null
          created_at: string
          data_aceite_privacidade: string | null
          data_aceite_termos: string | null
          email: string
          empresa_id: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          aceitou_privacidade?: boolean | null
          aceitou_termos?: boolean | null
          created_at?: string
          data_aceite_privacidade?: string | null
          data_aceite_termos?: string | null
          email: string
          empresa_id: string
          id: string
          nome: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          aceitou_privacidade?: boolean | null
          aceitou_termos?: boolean | null
          created_at?: string
          data_aceite_privacidade?: string | null
          data_aceite_termos?: string | null
          email?: string
          empresa_id?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_empresa_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      validar_cnpj: {
        Args: { cnpj_input: string }
        Returns: boolean
      }
      verificar_limite_plano: {
        Args: { empresa_id_param: string; tipo_limite: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
