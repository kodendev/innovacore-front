"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Menu } from "@/types/types";

import { MenuUpdateDialog } from "./MenuUpdateDialog";

interface Props {
  menu: Menu;
  deleteMenu: (menuId: number) => void;
}

const MenuCards = ({
  menu,

  deleteMenu,
}: Props) => {
  return (
    <div>
      <Card
        key={menu.id}
        className={`hover:shadow-lg transition-shadow  ${
          !menu.name ? "opacity-60" : ""
        }`}
      >
        <CardHeader>
          <CardTitle className="flex flex-col items-start gap-2 justify-between">
            <span>{menu.name}</span>
            <span className="text-sm font-medium text-slate-500">
              {menu.description}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className=" h-[100px]">
              <h4 className="font-medium mb-2">Ingredientes:</h4>
              <div className="space-y-1">
                {menu?.menuProducts?.map((ingredient, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {ingredient?.product?.name || "Producto no disponible"}
                    </span>
                    <span>
                      {/* {ingredient.qty} */}
                      {ingredient.quantity || "No disponible"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <MenuUpdateDialog menu={menu} />

              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMenu(menu.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuCards;
