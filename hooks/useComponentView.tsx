import { useState, useCallback } from "react";

type ViewType = "card" | "table";

export function useComponentView(initialView: ViewType = "card") {
  const [componentView, setComponentView] = useState<ViewType>(initialView);

  const toggleView = useCallback(() => {
    setComponentView((prev) => (prev === "card" ? "table" : "card"));
  }, []);

  return { componentView, toggleView };
}
