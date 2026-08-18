export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      credits: {
        Row: {
          id: number
          created_at: string
          credits: number
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          credits?: number
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          credits?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dodo_pricing_plans: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          price: number
          credits: number
          currency: string
          dodo_product_id: string | null
          is_active: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          price: number
          credits: number
          currency?: string
          dodo_product_id?: string | null
          is_active?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          price?: number
          credits?: number
          currency?: string
          dodo_product_id?: string | null
          is_active?: boolean
          metadata?: Json
        }
        Relationships: []
      }
      dodo_payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          dodo_payment_id: string | null
          dodo_checkout_session_id: string | null
          pricing_plan_id: string
          amount: number
          currency: string
          status: string
          credits: number
          metadata: Json
          completed_at: string | null
          failed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          dodo_payment_id?: string | null
          dodo_checkout_session_id?: string | null
          pricing_plan_id: string
          amount: number
          currency?: string
          status?: string
          credits: number
          metadata?: Json
          completed_at?: string | null
          failed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          dodo_payment_id?: string | null
          dodo_checkout_session_id?: string | null
          pricing_plan_id?: string
          amount?: number
          currency?: string
          status?: string
          credits?: number
          metadata?: Json
          completed_at?: string | null
          failed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dodo_payments_pricing_plan_id_fkey"
            columns: ["pricing_plan_id"]
            isOneToOne: false
            referencedRelation: "dodo_pricing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dodo_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dodo_subscriptions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          dodo_subscription_id: string | null
          pricing_plan_id: string
          status: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          dodo_subscription_id?: string | null
          pricing_plan_id: string
          status?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          dodo_subscription_id?: string | null
          pricing_plan_id?: string
          status?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "dodo_subscriptions_pricing_plan_id_fkey"
            columns: ["pricing_plan_id"]
            isOneToOne: false
            referencedRelation: "dodo_pricing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dodo_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dodo_webhook_events: {
        Row: {
          id: string
          created_at: string
          dodo_event_id: string
          event_type: string
          processed: boolean
          processed_at: string | null
          data: Json
          error_message: string | null
          retry_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          dodo_event_id: string
          event_type: string
          processed?: boolean
          processed_at?: string | null
          data: Json
          error_message?: string | null
          retry_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          dodo_event_id?: string
          event_type?: string
          processed?: boolean
          processed_at?: string | null
          data?: Json
          error_message?: string | null
          retry_count?: number
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string
          id: number
          modelId: number
          uri: string
        }
        Insert: {
          created_at?: string
          id?: number
          modelId: number
          uri: string
        }
        Update: {
          created_at?: string
          id?: number
          modelId?: number
          uri?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_modelId_fkey"
            columns: ["modelId"]
            referencedRelation: "models"
            referencedColumns: ["id"]
          }
        ]
      }
      models: {
        Row: {
          created_at: string
          id: number
          modelId: string | null
          name: string | null
          status: string
          type: string | null
          user_id: string | null
          auto_extend: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          modelId?: string | null
          name?: string | null
          status: string
          type?: string | null
          user_id?: string | null
          auto_extend?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          modelId?: string | null
          name?: string | null
          status?: string
          type?: string | null
          user_id?: string | null
          auto_extend?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "models_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts: {
        Row: {
          id: number
          user_id: string
          modelId: number
          promptId: string
          image_url: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          modelId: number
          promptId: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          modelId?: number
          promptId?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_modelId_fkey"
            columns: ["modelId"]
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      samples: {
        Row: {
          created_at: string
          id: number
          modelId: number
          uri: string
        }
        Insert: {
          created_at?: string
          id?: number
          modelId: number
          uri: string
        }
        Update: {
          created_at?: string
          id?: number
          modelId?: number
          uri?: string
        }
        Relationships: [
          {
            foreignKeyName: "samples_modelId_fkey"
            columns: ["modelId"]
            referencedRelation: "models"
            referencedColumns: ["id"]
          }
        ]
      }
      prompt_library: {
        Row: {
          id: string
          bucket: string
          slot: number
          prompt_template: string
          style_modifiers: Json
          posing_cues: Json
          params: Json
          is_active: boolean
          version: number
          created_at: string
        }
        Insert: {
          id?: string
          bucket: string
          slot: number
          prompt_template: string
          style_modifiers?: Json
          posing_cues?: Json
          params?: Json
          is_active?: boolean
          version?: number
          created_at?: string
        }
        Update: {
          id?: string
          bucket?: string
          slot?: number
          prompt_template?: string
          style_modifiers?: Json
          posing_cues?: Json
          params?: Json
          is_active?: boolean
          version?: number
          created_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          vibe: string
          style: string
          interests: string[] | null
          exclude_tags: string[] | null
          hobby_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vibe: string
          style: string
          interests?: string[] | null
          exclude_tags?: string[] | null
          hobby_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vibe?: string
          style?: string
          interests?: string[] | null
          exclude_tags?: string[] | null
          hobby_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_shoot_orders: {
        Row: {
          id: string
          user_id: string
          model_id: number
          preferences_id: string | null
          status: string
          trigger_run_id: string | null
          custom_credits_remaining: number
          photos_target: number
          fal_cost_cents: number
          refund_state: string
          created_at: string
          ready_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          model_id: number
          preferences_id?: string | null
          status?: string
          trigger_run_id?: string | null
          custom_credits_remaining?: number
          photos_target?: number
          fal_cost_cents?: number
          refund_state?: string
          created_at?: string
          ready_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          model_id?: number
          preferences_id?: string | null
          status?: string
          trigger_run_id?: string | null
          custom_credits_remaining?: number
          photos_target?: number
          fal_cost_cents?: number
          refund_state?: string
          created_at?: string
          ready_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_shoot_orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_shoot_orders_model_id_fkey"
            columns: ["model_id"]
            referencedRelation: "models"
            referencedColumns: ["id"]
          }
        ]
      }
      order_photos: {
        Row: {
          id: string
          order_id: string
          bucket: string
          slot: number
          prompt_template: string
          image_width: number | null
          image_height: number | null
          status: string
          fal_request_id: string | null
          image_url: string | null
          attempt_count: number
          failed_reason: string | null
          fal_cost_cents: number
          deterministic_id: string | null
          aesthetic_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          bucket: string
          slot: number
          prompt_template: string
          image_width?: number | null
          image_height?: number | null
          status?: string
          fal_request_id?: string | null
          image_url?: string | null
          attempt_count?: number
          failed_reason?: string | null
          fal_cost_cents?: number
          deterministic_id?: string | null
          aesthetic_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          bucket?: string
          slot?: number
          prompt_template?: string
          image_width?: number | null
          image_height?: number | null
          status?: string
          fal_request_id?: string | null
          image_url?: string | null
          attempt_count?: number
          failed_reason?: string | null
          fal_cost_cents?: number
          deterministic_id?: string | null
          aesthetic_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_photos_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "user_shoot_orders"
            referencedColumns: ["id"]
          }
        ]
      }
      one_day_followup_emails: {
        Row: {
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "one_day_followup_emails_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          has_completed_onboarding: boolean
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          has_completed_onboarding?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          has_completed_onboarding?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      followup_email_logs: {
        Row: {
          id: number
          user_id: string
          email_type: string
          sent_at: string
        }
        Insert: {
          id?: number
          user_id: string
          email_type: string
          sent_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          email_type?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "followup_email_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_credits: {
        Args: { user_id: string; amount: number }
        Returns: void
      }
      spend_credits: {
        Args: { p_user_id: string; p_amount: number }
        Returns: number | null
      }
      refund_credits: {
        Args: { p_user_id: string; p_amount: number }
        Returns: number
      }
      get_eligible_users: {
        Args: Record<PropertyKey, never>
        Returns: { id: string; email: string }[]
      },
      get_eligible_users_for_followup: {
        Args: {
          start_offset: string
          end_offset: string
          target_email_type: string
        }
        Returns: { id: string; email: string }[]
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

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Row: infer R
  }
    ? R
    : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Row: infer R
  }
    ? R
    : never)
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
    ? I
    : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
    ? I
    : never)
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
    ? U
    : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
    ? U
    : never)
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof (Database["public"]["Enums"])
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName])
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
  ? (Database["public"]["Enums"][PublicEnumNameOrOptions])
  : never