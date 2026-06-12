export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      daily_messages: {
        Row: {
          autor: string
          created_at: string
          destinatario: string
          id: string
          mensagem: string
        }
        Insert: {
          autor: string
          created_at?: string
          destinatario: string
          id?: string
          mensagem: string
        }
        Update: {
          autor?: string
          created_at?: string
          destinatario?: string
          id?: string
          mensagem?: string
        }
        Relationships: []
      }
      dedications: {
        Row: {
          autor: string
          created_at: string
          id: string
          imagem: string | null
          texto: string
          titulo: string
        }
        Insert: {
          autor: string
          created_at?: string
          id?: string
          imagem?: string | null
          texto: string
          titulo: string
        }
        Update: {
          autor?: string
          created_at?: string
          id?: string
          imagem?: string | null
          texto?: string
          titulo?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          data_evento: string
          descricao: string | null
          id: string
          imagem: string | null
          titulo: string
        }
        Insert: {
          created_at?: string
          data_evento: string
          descricao?: string | null
          id?: string
          imagem?: string | null
          titulo: string
        }
        Update: {
          created_at?: string
          data_evento?: string
          descricao?: string | null
          id?: string
          imagem?: string | null
          titulo?: string
        }
        Relationships: []
      }
      integration_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          provider: string
          refresh_token: string
          updated_at: string
          usuario: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          provider: string
          refresh_token: string
          updated_at?: string
          usuario: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          provider?: string
          refresh_token?: string
          updated_at?: string
          usuario?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string
          data_foto: string
          descricao: string | null
          favorita: boolean
          id: string
          image_url: string
          source: string
        }
        Insert: {
          created_at?: string
          data_foto: string
          descricao?: string | null
          favorita?: boolean
          id?: string
          image_url: string
          source?: string
        }
        Update: {
          created_at?: string
          data_foto?: string
          descricao?: string | null
          favorita?: boolean
          id?: string
          image_url?: string
          source?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          curiosidades: string | null
          foto: string | null
          id: string
          nome: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          curiosidades?: string | null
          foto?: string | null
          id: string
          nome: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          curiosidades?: string | null
          foto?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      spotify_status: {
        Row: {
          album: string
          artista: string
          capa: string
          created_at: string
          id: string
          musica: string
          reproduzindo_agora: boolean
          ultima_reproducao: string | null
          updated_at: string
          usuario: string
        }
        Insert: {
          album: string
          artista: string
          capa: string
          created_at?: string
          id?: string
          musica: string
          reproduzindo_agora?: boolean
          ultima_reproducao?: string | null
          updated_at?: string
          usuario: string
        }
        Update: {
          album?: string
          artista?: string
          capa?: string
          created_at?: string
          id?: string
          musica?: string
          reproduzindo_agora?: boolean
          ultima_reproducao?: string | null
          updated_at?: string
          usuario?: string
        }
        Relationships: []
      }
      story_sections: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          ordem: number
          titulo: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          id?: string
          ordem?: number
          titulo: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          ordem?: number
          titulo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
