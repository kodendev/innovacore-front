export function CreateOrderForm({
  roomNum,
  bedNum,
  patientName,
  onCreateOrder,
}) {
  const [orderItems, setOrderItems] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedBebidaId, setSelectedBebidaId] = useState("");

  const addMenuItem = () => {
    if (!selectedMenuId) return;
    const menu = menus.find((m) => m.id === Number.parseInt(selectedMenuId));
    if (menu) {
      const existing = orderItems.find((item) => item.name === menu.name);
      if (existing) {
        setOrderItems((prev) =>
          prev.map((item) =>
            item.name === menu.name ? { ...item, qty: item.qty + 1 } : item
          )
        );
      } else {
        setOrderItems((prev) => [
          ...prev,
          { name: menu.name, qty: 1, type: "menu" },
        ]);
      }
      setSelectedMenuId("");
    }
  };

  function CreateNewOrderForm({ onCreateOrder }) {
    const [formData, setFormData] = useState({
      patient: "",
      room: "",
      bed: "",
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    const [orderItems, setOrderItems] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState("");
    const [selectedBebidaId, setSelectedBebidaId] = useState("");

    const addMenuItem = () => {
      if (!selectedMenuId) return;
      const menu = menus.find((m) => m.id === Number.parseInt(selectedMenuId));
      if (menu) {
        const existing = orderItems.find((item) => item.name === menu.name);
        if (existing) {
          setOrderItems((prev) =>
            prev.map((item) =>
              item.name === menu.name ? { ...item, qty: item.qty + 1 } : item
            )
          );
        } else {
          setOrderItems((prev) => [
            ...prev,
            { name: menu.name, qty: 1, type: "menu" },
          ]);
        }
        setSelectedMenuId("");
      }
    };

    const addBebida = () => {
      if (!selectedBebidaId) return;
      const bebida = bebidas.find(
        (b) => b.id === Number.parseInt(selectedBebidaId)
      );
      if (bebida) {
        const existing = orderItems.find((item) => item.name === bebida.name);
        if (existing) {
          setOrderItems((prev) =>
            prev.map((item) =>
              item.name === bebida.name ? { ...item, qty: item.qty + 1 } : item
            )
          );
        } else {
          setOrderItems((prev) => [
            ...prev,
            { name: bebida.name, qty: 1, type: "bebida" },
          ]);
        }
        setSelectedBebidaId("");
      }
    };

    const removeItem = (itemName) => {
      setOrderItems((prev) => prev.filter((item) => item.name !== itemName));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (
        formData.patient &&
        formData.room &&
        formData.bed &&
        formData.time &&
        orderItems.length > 0
      ) {
        onCreateOrder({
          ...formData,
          items: orderItems,
        });
        // Reset form
        setFormData({
          patient: "",
          room: "",
          bed: "",
          time: new Date().toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        setOrderItems([]);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patient">Nombre del Paciente</Label>
            <Input
              id="patient"
              value={formData.patient}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, patient: e.target.value }))
              }
              placeholder="Nombre completo"
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Horario</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="room">Habitación</Label>
            <Input
              id="room"
              type="number"
              value={formData.room}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, room: e.target.value }))
              }
              placeholder="101"
              required
            />
          </div>
          <div>
            <Label htmlFor="bed">Cama</Label>
            <Input
              id="bed"
              type="number"
              value={formData.bed}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bed: e.target.value }))
              }
              placeholder="1"
              required
            />
          </div>
        </div>

        <div>
          <Label>Agregar Menú</Label>
          <div className="flex gap-2">
            <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar menú..." />
              </SelectTrigger>
              <SelectContent>
                {menus.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id.toString()}>
                    {menu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={addMenuItem}
              disabled={!selectedMenuId}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Agregar Bebida</Label>
          <div className="flex gap-2">
            <Select
              value={selectedBebidaId}
              onValueChange={setSelectedBebidaId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar bebida..." />
              </SelectTrigger>
              <SelectContent>
                {bebidas.map((bebida) => (
                  <SelectItem key={bebida.id} value={bebida.id.toString()}>
                    {bebida.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={addBebida}
              disabled={!selectedBebidaId}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {orderItems.length > 0 && (
          <div>
            <Label>Items de la Orden</Label>
            <div className="space-y-2 mt-2">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span>
                    {item.name} x{item.qty}
                    {item.type === "bebida" && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Bebida
                      </Badge>
                    )}
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.name)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={orderItems.length === 0}
        >
          Crear Orden
        </Button>
      </form>
    );
  }

  const addBebida = () => {
    if (!selectedBebidaId) return;
    const bebida = bebidas.find(
      (b) => b.id === Number.parseInt(selectedBebidaId)
    );
    if (bebida) {
      const existing = orderItems.find((item) => item.name === bebida.name);
      if (existing) {
        setOrderItems((prev) =>
          prev.map((item) =>
            item.name === bebida.name ? { ...item, qty: item.qty + 1 } : item
          )
        );
      } else {
        setOrderItems((prev) => [
          ...prev,
          { name: bebida.name, qty: 1, type: "bebida" },
        ]);
      }
      setSelectedBebidaId("");
    }
  };

  const removeItem = (itemName) => {
    setOrderItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderItems.length > 0) {
      onCreateOrder(roomNum, bedNum, patientName, orderItems);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Agregar Menú</Label>
        <div className="flex gap-2">
          <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar menú..." />
            </SelectTrigger>
            <SelectContent>
              {menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id.toString()}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={addMenuItem}
            disabled={!selectedMenuId}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Agregar Bebida</Label>
        <div className="flex gap-2">
          <Select value={selectedBebidaId} onValueChange={setSelectedBebidaId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar bebida..." />
            </SelectTrigger>
            <SelectContent>
              {bebidas.map((bebida) => (
                <SelectItem key={bebida.id} value={bebida.id.toString()}>
                  {bebida.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={addBebida}
            disabled={!selectedBebidaId}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {orderItems.length > 0 && (
        <div>
          <Label>Items de la Orden</Label>
          <div className="space-y-2 mt-2">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span>
                  {item.name} x{item.qty}
                  {item.type === "bebida" && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Bebida
                    </Badge>
                  )}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.name)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={orderItems.length === 0}
      >
        Crear Orden
      </Button>
    </form>
  );
}
