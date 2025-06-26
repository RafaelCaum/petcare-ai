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
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          notes: string | null
          pet_id: string
          updated_at: string
          user_email: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          notes?: string | null
          pet_id: string
          updated_at?: string
          user_email: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          notes?: string | null
          pet_id?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      pets: {
        Row: {
          avatar: string | null
          birth_date: string | null
          breed: string | null
          color: string | null
          created_at: string
          gender: string | null
          id: string
          name: string
          photo_url: string | null
          type: string
          updated_at: string
          user_email: string
          weight: number | null
        }
        Insert: {
          avatar?: string | null
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name: string
          photo_url?: string | null
          type: string
          updated_at?: string
          user_email: string
          weight?: number | null
        }
        Update: {
          avatar?: string | null
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          type?: string
          updated_at?: string
          user_email?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      premium_users: {
        Row: {
          created_at: string
          email: string
          id: string
          next_payment: string
          start_date: string
          status: string
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          next_payment: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          next_payment?: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          email_reminder: boolean
          id: string
          notes: string | null
          pet_id: string
          sms_reminder: boolean
          time: string
          title: string
          type: string
          updated_at: string
          user_email: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          email_reminder?: boolean
          id?: string
          notes?: string | null
          pet_id: string
          sms_reminder?: boolean
          time: string
          title: string
          type: string
          updated_at?: string
          user_email: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          email_reminder?: boolean
          id?: string
          notes?: string | null
          pet_id?: string
          sms_reminder?: boolean
          time?: string
          title?: string
          type?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_premium: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          subscription_end_date: string | null
          subscription_status: string
          trial_ends_at: string | null
          trial_start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_premium?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          subscription_end_date?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          trial_start_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_premium?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          subscription_end_date?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          trial_start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      vaccinations: {
        Row: {
          created_at: string
          date_given: string
          id: string
          image_url: string | null
          next_due_date: string
          notes: string | null
          pet_id: string
          updated_at: string
          user_email: string
          vaccine_name: string
          veterinarian: string | null
        }
        Insert: {
          created_at?: string
          date_given: string
          id?: string
          image_url?: string | null
          next_due_date: string
          notes?: string | null
          pet_id: string
          updated_at?: string
          user_email: string
          vaccine_name: string
          veterinarian?: string | null
        }
        Update: {
          created_at?: string
          date_given?: string
          id?: string
          image_url?: string | null
          next_due_date?: string
          notes?: string | null
          pet_id?: string
          updated_at?: string
          user_email?: string
          vaccine_name?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccinations_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      zapier_webhooks: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_email: string
          webhook_type: string
          webhook_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_email: string
          webhook_type: string
          webhook_url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_email?: string
          webhook_type?: string
          webhook_url?: string
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
