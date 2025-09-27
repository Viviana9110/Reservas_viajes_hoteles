import React, { useState } from "react";
import axios from "axios";
import Title from '../../components/Title'
import { useAppContext } from "../../context/AppContext.jsx";

const AddHotel = () => {
  const { token, logoutUser } = useAppContext(); // 👈 obtenemos el token desde el contexto

  const [hotel, setHotel] = useState({
    name: "",
    country: "",
    city: "",
    address: "",
    description: "",
    amenities: "",
    pricePerNight: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        alert("❌ Debes iniciar sesión para registrar un hotel");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/hotels`,
        {
          name: hotel.name,
          location: {
            country: hotel.country,
            city: hotel.city,
            address: hotel.address,
          },
          description: hotel.description,
          amenities: hotel.amenities
            ? hotel.amenities.split(",").map((a) => a.trim())
            : [],
          pricePerNight: hotel.pricePerNight,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 usamos token desde contexto
          }}
      );

      alert("✅ Hotel registrado correctamente");
      console.log(res.data);

      // limpiar formulario
      setHotel({
        name: "",
        country: "",
        city: "",
        address: "",
        description: "",
        amenities: "",
        pricePerNight: "",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("⚠️ Sesión expirada. Vuelve a iniciar sesión.");
        if (logoutUser) logoutUser(); // 👈 usamos el método del contexto
      } else {
        alert("❌ Error al registrar hotel");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form
        className="md:p-10 p-4 space-y-5 max-w-lg"
        onSubmit={handleSubmit}
      >
      <Title align='left' font='outfit' title='Add Hotel' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.' />

        {/* Nombre del hotel */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="hotel-name">
            Hotel
          </label>
          <input
            type="text"
            name="name"
            value={hotel.name}
            onChange={handleChange}
            placeholder="Nombre del Hotel"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* País y Ciudad */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="country">
              País
            </label>
            <input
              type="text"
              name="country"
              value={hotel.country}
              onChange={handleChange}
              placeholder="Ej: Colombia"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="city">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              value={hotel.city}
              onChange={handleChange}
              placeholder="Ej: Medellín"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="address">
            Dirección
          </label>
          <input
            type="text"
            name="address"
            value={hotel.address}
            onChange={handleChange}
            placeholder="Dirección"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="description">
            Descripción
          </label>
          <textarea
            name="description"
            value={hotel.description}
            onChange={handleChange}
            placeholder="Descripción"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
          ></textarea>
        </div>

        {/* Amenidades */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="amenities">
            Amenidades (separadas por coma)
          </label>
          <input
            type="text"
            name="amenities"
            value={hotel.amenities}
            onChange={handleChange}
            placeholder="Wifi, Piscina, Parqueadero"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          />
        </div>

        {/* Precio por noche */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="pricePerNight">
            Precio por Noche
          </label>
          <input
            type="number"
            name="pricePerNight"
            value={hotel.pricePerNight}
            onChange={handleChange}
            placeholder="Ej: 150000"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          />
        </div>

        {/* Botón */}
        <button
          className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar Hotel"}
        </button>
      </form>
    </div>
  );
};

export default AddHotel;
