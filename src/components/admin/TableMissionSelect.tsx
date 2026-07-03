"use client";

import { useRef } from "react";
import { assignTableMission } from "../../actions/missions.actions";
import type { Mission } from "../../lib/types/mission";

const selectClass =
  "min-h-11 w-full rounded-[0.3rem] border border-tinta/25 bg-[#fffaf0] px-3 py-2 text-sm text-tinta outline-none transition focus:border-lavanda focus:ring-4 focus:ring-lavanda/15";

type Props = {
  tableId: string;
  currentMissionId: string | null;
  missions: Mission[];
};

export function TableMissionSelect({ tableId, currentMissionId, missions }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={assignTableMission}>
      <input type="hidden" name="tableId" value={tableId} />
      <select
        name="missionId"
        defaultValue={currentMissionId ?? ""}
        className={selectClass}
        onChange={() => formRef.current?.requestSubmit()}
      >
        <option value="">— Sin mision —</option>
        {missions.map((mission) => (
          <option key={mission.id} value={mission.id}>
            {mission.title}
            {mission.isActive ? "" : " (oculta)"}
          </option>
        ))}
      </select>
    </form>
  );
}
