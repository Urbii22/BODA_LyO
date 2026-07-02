export type MissionDifficulty = "easy" | "medium" | "hard" | "epic";
export type MissionCategory = "social" | "photo" | "dance" | "emotional" | "funny";

export type Mission = {
  id: string;
  weddingId: string;
  title: string;
  description: string;
  points: number;
  difficulty: MissionDifficulty;
  category: MissionCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
