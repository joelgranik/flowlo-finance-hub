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
      bank_balances: {
        Row: {
          account_name: string
          category_id: string | null
          created_at: string
          created_by: string | null
          date: string
          ending_balance: number
          id: string
          notes: string | null
          tags: string | null
        }
        Insert: {
          account_name?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          ending_balance: number
          id?: string
          notes?: string | null
          tags?: string | null
        }
        Update: {
          account_name?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          ending_balance?: number
          id?: string
          notes?: string | null
          tags?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_balances_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean | null
          category_name: string
          created_at: string
          created_by: string | null
          id: string
          type: string
        }
        Insert: {
          active?: boolean | null
          category_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          type: string
        }
        Update: {
          active?: boolean | null
          category_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          type?: string
        }
        Relationships: []
      }
      current_membership_counts: {
        Row: {
          active_members: number | null
          created_at: string
          created_by: string | null
          id: string
          membership_tier_id: string
        }
        Insert: {
          active_members?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          membership_tier_id: string
        }
        Update: {
          active_members?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          membership_tier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "current_membership_counts_membership_tier_id_fkey"
            columns: ["membership_tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_cash_log: {
        Row: {
          actual_inflows: number | null
          actual_outflows: number | null
          classpass_payout_received: number | null
          created_at: string
          created_by: string | null
          end_of_day_balance: number | null
          id: string
          log_date: string
          mindbody_expected_tomorrow: number | null
          notes: string | null
          shopify_expected_tomorrow: number | null
          start_balance: number | null
        }
        Insert: {
          actual_inflows?: number | null
          actual_outflows?: number | null
          classpass_payout_received?: number | null
          created_at?: string
          created_by?: string | null
          end_of_day_balance?: number | null
          id?: string
          log_date: string
          mindbody_expected_tomorrow?: number | null
          notes?: string | null
          shopify_expected_tomorrow?: number | null
          start_balance?: number | null
        }
        Update: {
          actual_inflows?: number | null
          actual_outflows?: number | null
          classpass_payout_received?: number | null
          created_at?: string
          created_by?: string | null
          end_of_day_balance?: number | null
          id?: string
          log_date?: string
          mindbody_expected_tomorrow?: number | null
          notes?: string | null
          shopify_expected_tomorrow?: number | null
          start_balance?: number | null
        }
        Relationships: []
      }
      membership_tiers: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          monthly_fee: number | null
          tier_name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          monthly_fee?: number | null
          tier_name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          monthly_fee?: number | null
          tier_name?: string
        }
        Relationships: []
      }
      reference_lists: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          reference_order: number | null
          reference_type: string
          reference_value: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          reference_order?: number | null
          reference_type: string
          reference_value: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          reference_order?: number | null
          reference_type?: string
          reference_value?: string
        }
        Relationships: []
      }
      scheduled_items: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          expected_amount: number | null
          expected_date: string | null
          id: string
          item_name: string
          notes: string | null
          tags: string | null
          type: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          expected_amount?: number | null
          expected_date?: string | null
          id?: string
          item_name: string
          notes?: string | null
          tags?: string | null
          type?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          expected_amount?: number | null
          expected_date?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          tags?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      app_role: "Staff" | "Partner"
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
    Enums: {
      app_role: ["Staff", "Partner"],
    },
  },
} as const
