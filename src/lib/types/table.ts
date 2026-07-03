import type { Mission } from "./mission";

export type WeddingTable = {
  id: string;
  weddingId: string;
  code: string;
  name: string;
  displayOrder: number;
  manualPoints: number;
  missionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TableWithMission = WeddingTable & {
  mission: Mission | null;
};
