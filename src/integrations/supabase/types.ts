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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string
          content: string
          created_at: string
          expires_at: string | null
          id: string
          image_url: string | null
          is_pinned: boolean
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          priority?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_cards: {
        Row: {
          accent_color: string
          bio: string | null
          company: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          instagram: string | null
          linkedin: string | null
          phone: string | null
          primary_color: string
          profession: string
          secondary_color: string
          template: string
          twitter: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          accent_color?: string
          bio?: string | null
          company: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          instagram?: string | null
          linkedin?: string | null
          phone?: string | null
          primary_color?: string
          profession: string
          secondary_color?: string
          template?: string
          twitter?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          accent_color?: string
          bio?: string | null
          company?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          instagram?: string | null
          linkedin?: string | null
          phone?: string | null
          primary_color?: string
          profession?: string
          secondary_color?: string
          template?: string
          twitter?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string
          donor_email: string | null
          donor_id: string | null
          donor_name: string
          id: string
          is_anonymous: boolean
          message: string | null
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string
          donor_email?: string | null
          donor_id?: string | null
          donor_name: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string
          donor_email?: string | null
          donor_id?: string | null
          donor_name?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "fundraising_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          checked_in_at: string | null
          created_at: string
          event_id: string
          id: string
          status: string
          ticket_code: string | null
          user_id: string
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string
          event_id: string
          id?: string
          status?: string
          ticket_code?: string | null
          user_id: string
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          ticket_code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sponsors: {
        Row: {
          created_at: string
          event_id: string
          id: string
          logo_url: string | null
          name: string
          tier: string
          website: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          logo_url?: string | null
          name: string
          tier?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          logo_url?: string | null
          name?: string
          tier?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_ticketed: boolean
          location: string | null
          max_attendees: number | null
          start_date: string
          status: string
          ticket_price: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_ticketed?: boolean
          location?: string | null
          max_attendees?: number | null
          start_date: string
          status?: string
          ticket_price?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_ticketed?: boolean
          location?: string | null
          max_attendees?: number | null
          start_date?: string
          status?: string
          ticket_price?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          amenities: string[] | null
          capacity: number | null
          created_at: string
          description: string | null
          hourly_rate: number | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      facility_bookings: {
        Row: {
          created_at: string
          end_time: string
          facility_id: string
          id: string
          notes: string | null
          start_time: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          facility_id: string
          id?: string
          notes?: string | null
          start_time: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          facility_id?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_bookings_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      fundraising_campaigns: {
        Row: {
          category: string
          created_at: string
          description: string
          end_date: string | null
          goal_amount: number
          id: string
          image_url: string | null
          raised_amount: number
          status: string
          story: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          end_date?: string | null
          goal_amount: number
          id?: string
          image_url?: string | null
          raised_amount?: number
          status?: string
          story?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          end_date?: string | null
          goal_amount?: number
          id?: string
          image_url?: string | null
          raised_amount?: number
          status?: string
          story?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          created_at: string
          id: string
          option_text: string
          poll_id: string
          vote_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          option_text: string
          poll_id: string
          vote_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          option_text?: string
          poll_id?: string
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_anonymous: boolean
          poll_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean
          poll_type?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean
          poll_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          is_public: boolean
          location: string | null
          occupation: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_public?: boolean
          location?: string | null
          occupation?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_public?: boolean
          location?: string | null
          occupation?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      volunteer_opportunities: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          duration: string | null
          id: string
          location: string | null
          skills_needed: string[] | null
          spots_available: number | null
          spots_filled: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          location?: string | null
          skills_needed?: string[] | null
          spots_available?: number | null
          spots_filled?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          location?: string | null
          skills_needed?: string[] | null
          spots_available?: number | null
          spots_filled?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      volunteer_signups: {
        Row: {
          created_at: string
          id: string
          message: string | null
          opportunity_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_signups_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "volunteer_opportunities"
            referencedColumns: ["id"]
          },
        ]
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
