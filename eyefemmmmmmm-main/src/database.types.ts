// Add the csm_doctor_treatments_1 table to the database schema
// Look for the Tables interface and add the new table definition

// Example:
// export interface Database {
//   public: {
//     Tables: {
//       csm_doctor_treatments_1: {
//         Row: {
//           id: string
//           title: string
//           description: string | null
//           bullet_points: string[] | null
//           button_text: string | null
//           created_at: string
//         }
//         Insert: {
//           id?: string
//           title: string
//           description?: string | null
//           bullet_points?: string[] | null
//           button_text?: string | null
//           created_at?: string
//         }
//         Update: {
//           id?: string
//           title?: string
//           description?: string | null
//           bullet_points?: string[] | null
//           button_text?: string | null
//           created_at?: string
//         }
//       }
//       // other tables...
//     }
//   }
// } 

export interface Database {
  public: {
    Tables: {
      csm_landingpage_getstarted: {
        Row: {
          id: string
          name: string
          heading: string | null
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          heading?: string | null
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          heading?: string | null
          description?: string | null
          created_at?: string | null
        }
      }
      // Add other tables as needed...
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
  }
} 