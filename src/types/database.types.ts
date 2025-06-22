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
            group_members: {
                Row: {
                    group_id: string
                    group_role: string | null
                    user_id: string | null
                }
                Insert: {
                    group_id: string
                    group_role?: string | null
                    user_id?: string | null
                }
                Update: {
                    group_id?: string
                    group_role?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "group_members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "public_users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            groups: {
                Row: {
                    creator_id: string | null
                    description: string | null
                    icon: string | null
                    id: string
                    name: string
                }
                Insert: {
                    creator_id?: string | null
                    description?: string | null
                    icon?: string | null
                    id?: string
                    name: string
                }
                Update: {
                    creator_id?: string | null
                    description?: string | null
                    icon?: string | null
                    id?: string
                    name?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "groups_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "public_users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            private_user_details: {
                Row: {
                    full_name: string
                    hashed_password: string
                    last_login_at: string | null
                    phone_number: string | null
                    user_id: string
                }
                Insert: {
                    full_name: string
                    hashed_password: string
                    last_login_at?: string | null
                    phone_number?: string | null
                    user_id?: string
                }
                Update: {
                    full_name?: string
                    hashed_password?: string
                    last_login_at?: string | null
                    phone_number?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "private_user_details_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "public_users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            public_users: {
                Row: {
                    created_at: string
                    favorite_color: string | null
                    id: string
                    role: string
                    username: string
                }
                Insert: {
                    created_at?: string
                    favorite_color?: string | null
                    id?: string
                    role?: string
                    username?: string
                }
                Update: {
                    created_at?: string
                    favorite_color?: string | null
                    id?: string
                    role?: string
                    username?: string
                }
                Relationships: []
            }
            transactions: {
                Row: {
                    amount: number
                    borrower_id: string
                    group_id: string
                    id: string
                    lender_id: string
                    transaction_date: string | null
                    transaction_type: boolean
                }
                Insert: {
                    amount: number
                    borrower_id: string
                    group_id: string
                    id?: string
                    lender_id: string
                    transaction_date?: string | null
                    transaction_type: boolean
                }
                Update: {
                    amount?: number
                    borrower_id?: string
                    group_id?: string
                    id?: string
                    lender_id?: string
                    transaction_date?: string | null
                    transaction_type?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: "transactions_borrower_id_fkey"
                        columns: ["borrower_id"]
                        isOneToOne: true
                        referencedRelation: "public_users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_lender_id_fkey"
                        columns: ["lender_id"]
                        isOneToOne: true
                        referencedRelation: "public_users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_codes: {
                Row: {
                    created_at: string
                    id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                }
                Update: {
                    created_at?: string
                    id?: string
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
