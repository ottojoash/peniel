export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      room_types: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: number
          room_type_id: number
          name: string
          slug: string
          description: string | null
          long_description: string | null
          size: string | null
          max_occupancy: number
          bed_type: string | null
          is_featured: boolean
          is_active: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          room_type_id: number
          name: string
          slug: string
          description?: string | null
          long_description?: string | null
          size?: string | null
          max_occupancy?: number
          bed_type?: string | null
          is_featured?: boolean
          is_active?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          room_type_id?: number
          name?: string
          slug?: string
          description?: string | null
          long_description?: string | null
          size?: string | null
          max_occupancy?: number
          bed_type?: string | null
          is_featured?: boolean
          is_active?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      room_features: {
        Row: {
          id: number
          name: string
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      room_features_junction: {
        Row: {
          room_id: number
          feature_id: number
        }
        Insert: {
          room_id: number
          feature_id: number
        }
        Update: {
          room_id?: number
          feature_id?: number
        }
      }
      room_images: {
        Row: {
          id: number
          room_id: number
          image_url: string
          alt_text: string | null
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: number
          room_id: number
          image_url: string
          alt_text?: string | null
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          room_id?: number
          image_url?: string
          alt_text?: string | null
          display_order?: number | null
          created_at?: string
        }
      }
      room_rates: {
        Row: {
          id: number
          room_id: number
          rate_name: string | null
          price_per_night: number
          currency: string | null
          is_default: boolean | null
          valid_from: string | null
          valid_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          room_id: number
          rate_name?: string | null
          price_per_night: number
          currency?: string | null
          is_default?: boolean | null
          valid_from?: string | null
          valid_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          room_id?: number
          rate_name?: string | null
          price_per_night?: number
          currency?: string | null
          is_default?: boolean | null
          valid_from?: string | null
          valid_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      room_policies: {
        Row: {
          id: number
          room_id: number
          policy_text: string
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          room_id: number
          policy_text: string
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          room_id?: number
          policy_text?: string
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: number
          booking_reference: string
          room_id: number | null
          guest_name: string
          guest_email: string
          guest_phone: string | null
          check_in_date: string
          check_out_date: string
          number_of_guests: number
          total_amount: number
          status: string
          payment_status: string
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          booking_reference: string
          room_id?: number | null
          guest_name: string
          guest_email: string
          guest_phone?: string | null
          check_in_date: string
          check_out_date: string
          number_of_guests?: number
          total_amount: number
          status?: string
          payment_status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          booking_reference?: string
          room_id?: number | null
          guest_name?: string
          guest_email?: string
          guest_phone?: string | null
          check_in_date?: string
          check_out_date?: string
          number_of_guests?: number
          total_amount?: number
          status?: string
          payment_status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

