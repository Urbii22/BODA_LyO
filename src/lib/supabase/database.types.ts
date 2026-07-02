import type { MissionCategory, MissionDifficulty } from "../types/mission";
import type { SubmissionStatus } from "../types/submission";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      weddings: TableDefinition<
        {
          id: string;
          slug: string;
          couple_name: string;
          title: string;
          wedding_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          slug: string;
          couple_name: string;
          title: string;
          wedding_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      missions: TableDefinition<
        {
          id: string;
          wedding_id: string;
          title: string;
          description: string;
          points: number;
          difficulty: MissionDifficulty;
          category: MissionCategory;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          wedding_id: string;
          title: string;
          description: string;
          points: number;
          difficulty: MissionDifficulty;
          category: MissionCategory;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      tables: TableDefinition<
        {
          id: string;
          wedding_id: string;
          code: string;
          name: string;
          display_order: number;
          mission_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          wedding_id: string;
          code: string;
          name: string;
          display_order?: number;
          mission_id?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      submissions: TableDefinition<
        {
          id: string;
          wedding_id: string;
          table_id: string;
          mission_id: string;
          participant_name: string;
          comment: string | null;
          media_path: string;
          status: SubmissionStatus;
          awarded_points: number;
          admin_note: string | null;
          created_at: string;
          reviewed_at: string | null;
          updated_at: string;
        },
        {
          id?: string;
          wedding_id: string;
          table_id: string;
          mission_id: string;
          participant_name: string;
          comment?: string | null;
          media_path: string;
          status?: SubmissionStatus;
          awarded_points?: number;
          admin_note?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          updated_at?: string;
        },
        {
          status?: SubmissionStatus;
          awarded_points?: number;
          admin_note?: string | null;
          reviewed_at?: string | null;
          updated_at?: string;
        }
      >;
    };
    Views: {
      ranking_view: {
        Row: {
          table_id: string;
          wedding_id: string;
          table_name: string;
          table_code: string;
          display_order: number;
          total_points: number;
          approved_count: number;
          first_approved_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type { Json };
