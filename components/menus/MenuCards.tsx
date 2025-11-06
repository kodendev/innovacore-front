"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Menu } from "@/types/types";

import { MenuUpdateDialog } from "./MenuUpdateDialog";
import { getBadgeLabel, getBadgeVariant } from "@/utils/badge_variants";
import { Badge } from "../ui/badge";

interface Props {
  menu: Menu;
  deleteMenu: (menuId: number) => void;
  toggleMenuStatus: (menuId: number) => void;
}

const MenuCards = ({ menu, deleteMenu, toggleMenuStatus }: Props) => {
  const { id, name, active, menuProducts } = menu;

  return (
    <div>
      <Card
        key={id}
        className={`hover:shadow-lg transition-shadow  ${
          !name ? "opacity-60" : ""
        }`}
      >
        <CardHeader>
          <CardTitle className="flex flex-row items-start h-10 gap-2 justify-between">
            <span>{name}</span>

            <Badge
              variant={getBadgeVariant(
                active === true ? "Activo" : "Inactivo"
              )}
              onClick={() => toggleMenuStatus(id)}
            >
              {getBadgeLabel(active === true ? "Activo" : "Inactivo")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 h-30 ">
            <div className="max-h-32 min-h-[72px] overflow-y-auto pr-1">
              <h4 className="font-medium mb-2">Ingredientes:</h4>
              <div className="space-y-1">
                {menuProducts?.slice(0, 2).map((ingredient, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {ingredient?.product?.name || "Producto no disponible"}
                    </span>
                    <span>{ingredient.quantity || "No disponible"}</span>
                  </div>
                ))}
                {menuProducts && menuProducts.length > 3 && (
                  <div className="text-sm text-slate-500">
                    +{menuProducts.length - 2} más
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-4">
            <MenuUpdateDialog menu={menu} />

            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMenu(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuCards;
