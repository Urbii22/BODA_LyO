export type RankingRow = {
  tableId: string;
  weddingId: string;
  tableName: string;
  tableCode: string;
  displayOrder: number;
  totalPoints: number;
  approvedCount: number;
  firstApprovedAt: string | null;
};
