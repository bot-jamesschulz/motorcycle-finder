import { type SortMethod } from '@/components/Sort'
import type {  
  PriceRange,
  YearRange
} from '@/lib/defaults'
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
      dealerships: {
        Row: {
          city: string | null
          location: unknown
          name: string | null
          url: string
        }
        Insert: {
          city?: string | null
          location: unknown
          name?: string | null
          url: string
        }
        Update: {
          city?: string | null
          location?: unknown
          name?: string | null
          url?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          condition: string | null
          dealership: string | null
          detailsUrl: string
          imgSrc: string | null
          listing: string | null
          make: string
          mileage: number | null
          model: string | null
          price: number | null
          year: number | null
        }
        Insert: {
          condition?: string | null
          dealership?: string | null
          detailsUrl: string
          imgSrc?: string | null
          listing?: string | null
          make: string
          mileage?: number | null
          model?: string | null
          price?: number | null
          year?: number | null
        }
        Update: {
          condition?: string | null
          dealership?: string | null
          detailsUrl?: string
          imgSrc?: string | null
          listing?: string | null
          make?: string
          mileage?: number | null
          model?: string | null
          price?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_listings_dealership_fkey"
            columns: ["dealership"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["url"]
          },
        ]
      }
      locations: {
        Row: {
          zip_code: string
          full_name: string
          city: string
          county: string
          state: string
          longitude: number
          latitude: number
          state_abrv: string
        }
        Insert: {
          zip_code: string
          full_name: string
          city: string
          county: string
          state: string
          longitude: number
          latitude: number
          state_abrv: string
        }
        Update: {
          zip_code: string
          full_name: string
          city: string
          county: string
          state: string
          longitude: number
          latitude: number
          state_abrv: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      autocomplete: {
        Args: {
          search: string
        }
        Returns: {
          greatest_sml: number
          city_state: string
          zip_code: string
          longitude: number
          latitude: number
        }[]
      }
      dealerships_in_range: {
        Args: {
          x: number
          y: number
          range: number
        }
        Returns: {
          url: string
          name: string
          city: string
          location: unknown
        }[]
      }
      proximity_search: {
        Args: {
          x: number
          y: number
          range: number
          keyword: string
          pageNum: number
          sortMethod: SortMethod
          makeFilter: string[]
          modelFilter: string[]
          priceFilter: PriceRange
          hideNullPrices: boolean
          yearFilter: YearRange
        }
        Returns: {
          make: string
          model: string
          year: number
          price: number
          mileage: number
          condition: string
          detailsUrl: string
          imgSrc: string
          dealerName: string
          city: string
          distance: number
          matchScore: number
        }[]
      }
      proximity_search_results_count: {
        Args: {
          x: number
          y: number
          range: number
          keyword: string
          makeFilter: string[]
          modelFilter: string[]
          priceFilter: PriceRange
          hideNullPrices: boolean
          yearFilter: YearRange
        }
        Returns: {
          results_count: number
        }[]
      }
      make_count_in_range: {
        Args: {
          x: number
          y: number
          range: number
          price_filter: number[]
          year_filter: number[]
          hide_null_prices: boolean
        }
        Returns: {
          make: string
          count: number
        }[]
      }
      model_count_in_range: {
        Args: {
          x: number
          y: number
          range: number
          make_filter: string[]
          price_filter: number[]
          year_filter: number[]
          hide_null_prices: boolean
        }
        Returns: {
          make: string
          model: string
          count: number
        }[]
      }
      test: {
        Args: {
          keyword: string
        }
        Returns: {
          keyword: string
        }[]
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
