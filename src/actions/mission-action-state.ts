export type MissionActionState = {
  ok: boolean;
  message: string;
};

export const missionInitialState: MissionActionState = { ok: false, message: "" };
