import { Room } from "@/types/camas/bedTypes";

export function pickActiveBedMenu(bed: Room["beds"][0]) {
  if (!bed?.bedMenus?.length) return null;
  const sorted = [...bed.bedMenus].sort((a, b) => {
    const ta = a.assignedAt ? new Date(a.assignedAt).getTime() : 0;
    const tb = b.assignedAt ? new Date(b.assignedAt).getTime() : 0;
    return tb - ta;
  });
  return sorted.find((bm) => !bm.consumed) ?? sorted[0];
}
