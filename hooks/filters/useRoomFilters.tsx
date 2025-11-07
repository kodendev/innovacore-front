import { useState } from "react";

export interface RoomFilters {
  roomStatus?: "active" | "inactive";
  floor?: number;
  bedStatus?: "available" | "occupied" | "maintenance";
  menuConsumed?: boolean;
  name?: string;
}

export const useRoomFilters = () => {
  const [filters, setFilters] = useState<RoomFilters>({});

  const updateFilter = (key: keyof RoomFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => setFilters({});

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
