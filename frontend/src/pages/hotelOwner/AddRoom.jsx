import React, { useState, useEffect } from "react";
import axios from "axios";

const AddRoom = () => {
  const [hotels, setHotels] = useState([]);
  const [room, setRoom] = useState({
    hotelId: "",
    roomNumber: "",
    type: "single",
    pricePerNight: "",
    description: "",
    capacity: 1,
  });

  // 🔹 Cargar hoteles registrados al montar
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/hotels`);
        setHotels(res.data);
      } catch (err) {
        console.error("Error al cargar hoteles:", err);
      }
    };
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!room.hotelId) {
      alert("Debe seleccionar un hotel ❌");
      return;
    }

    try {
  const token = localStorage.getItem("token");
  await axios.post(
    `${import.meta.env.VITE_API_URL}/hotels/${room.hotelId}/rooms`,
    room,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  alert("Habitación añadida con éxito ✅");

  setRoom({
    hotelId: "",
    roomNumber: "",
    type: "",
    pricePerNight: "",
    capacity: "",
    description: "",

  })
} catch (error) {
  console.error("Error al añadir habitación:", error.response?.data || error.message);
  alert("Error al añadir habitación ❌");
}
  }

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* 🔹 Select con hoteles */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="hotelId">
            Hotel
          </label>
          <select
            id="hotelId"
            name="hotelId"
            value={room.hotelId}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Seleccione Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 N° Habitación */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">N° Habitación</label>
          <input
            id="roomNumber"
            name="roomNumber"
            value={room.roomNumber}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* 🔹 Tipo */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Tipo</label>
          <select
            name="type"
            value={room.type}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Seleccione</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        {/* 🔹 Precio */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Precio por noche</label>
          <input
            type="number"
            name="pricePerNight"
            value={room.pricePerNight}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* 🔹 Capacidad */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Capacidad</label>
          <input
            type="number"
            name="capacity"
            value={room.capacity}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* 🔹 Descripción */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Descripción</label>
          <textarea
            name="description"
            value={room.description}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Escriba una descripción"
          ></textarea>
        </div>

        {/* 🔹 Botón */}
        <button className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">
          Añadir Habitación
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
