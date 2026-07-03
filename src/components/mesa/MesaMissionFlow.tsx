"use client";

import { useState } from "react";
import type { Mission } from "../../lib/types/mission";
import type { SubmissionMode } from "../../lib/utils/submission-mode";
import { MissionCard } from "./MissionCard";
import { SubmissionForm } from "./SubmissionForm";

type MesaMissionFlowProps = {
  mission: Mission | null;
  tableCode: string;
};

export function MesaMissionFlow({ mission, tableCode }: MesaMissionFlowProps) {
  const [mode, setMode] = useState<SubmissionMode>("normal");

  return (
    <>
      <MissionCard mission={mission} mode={mode} onModeChange={setMode} />
      <SubmissionForm tableCode={tableCode} mode={mode} mission={mission} />
    </>
  );
}
