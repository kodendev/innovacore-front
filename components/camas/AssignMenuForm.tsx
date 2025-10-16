import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { useState } from "react";
import { Label } from "recharts";
import { SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AssignMenuForm({ roomNum, bedNum, currentPatient, onAssign }) {
  const [patientName, setPatientName] = useState(currentPatient || "");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [time, setTime] = useState("12:00");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (patientName && selectedMenu && time) {
      onAssign(roomNum, bedNum, patientName, selectedMenu, time);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="patient">Nombre del Paciente</Label>
        <Input
          id="patient"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Ingrese el nombre del paciente"
          required
        />
      </div>

      <div>
        <Label htmlFor="menu">Menú</Label>
        <Select value={selectedMenu} onValueChange={setSelectedMenu} required>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un menú" />
          </SelectTrigger>
          <SelectContent>
            {menus.map((menu) => (
              <SelectItem key={menu.id} value={menu.id.toString()}>
                {menu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="time">Horario</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Asignar Menú
      </Button>
    </form>
  );
}
