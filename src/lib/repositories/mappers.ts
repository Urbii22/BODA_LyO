import type { Mission, MissionCategory, MissionDifficulty } from "../types/mission";
import type { RankingRow } from "../types/ranking";
import type { Submission, SubmissionStatus } from "../types/submission";
import type { WeddingTable } from "../types/table";
import type { Wedding } from "../types/wedding";

type WeddingRow = {
  id: string;
  slug: string;
  couple_name: string;
  title: string;
  wedding_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type MissionRow = {
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
};

type TableRow = {
  id: string;
  wedding_id: string;
  code: string;
  name: string;
  display_order: number;
  mission_id: string | null;
  created_at: string;
  updated_at: string;
};

type SubmissionRow = {
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
};

type RankingRowDb = {
  table_id: string;
  wedding_id: string;
  table_name: string;
  table_code: string;
  display_order: number;
  total_points: number;
  approved_count: number;
  first_approved_at: string | null;
};

export type { MissionRow, RankingRowDb, SubmissionRow, TableRow, WeddingRow };

export function mapWedding(row: WeddingRow): Wedding {
  return {
    id: row.id,
    slug: row.slug,
    coupleName: row.couple_name,
    title: row.title,
    weddingDate: row.wedding_date,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMission(row: MissionRow): Mission {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    title: row.title,
    description: row.description,
    points: row.points,
    difficulty: row.difficulty,
    category: row.category,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTable(row: TableRow): WeddingTable {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    code: row.code,
    name: row.name,
    displayOrder: row.display_order,
    missionId: row.mission_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    tableId: row.table_id,
    missionId: row.mission_id,
    participantName: row.participant_name,
    comment: row.comment,
    mediaPath: row.media_path,
    status: row.status,
    awardedPoints: row.awarded_points,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    updatedAt: row.updated_at,
  };
}

export function mapRankingRow(row: RankingRowDb): RankingRow {
  return {
    tableId: row.table_id,
    weddingId: row.wedding_id,
    tableName: row.table_name,
    tableCode: row.table_code,
    displayOrder: row.display_order,
    totalPoints: Number(row.total_points),
    approvedCount: Number(row.approved_count),
    firstApprovedAt: row.first_approved_at,
  };
}
