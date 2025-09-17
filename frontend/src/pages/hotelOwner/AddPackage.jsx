import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPackage = () => {
  const [paquete, setPaquete] = useState({
    name: "",
    destination: "",
    description: "",
    price: "",
    days: "",
  });

   const handleChange = (e) => {
    setPaquete({ ...paquete, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`http://localhost:4000/api/packages`, paquete);      
      alert("Paquete añadido con éxito ✅");

    } catch (error) {
      console.error("Error al añadir paquete:", error.response?.data || error.message);
      alert("Error al añadir paquete ❌");
    }
  }

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Nombre</label>
          <input
            id="name"
            name="name"
            value={paquete.name}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Destino</label>
          <input
            id="destination"
            name="destination"
            value={paquete.destination}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Descripción</label>
          <textarea
            name="description"
            value={paquete.description}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Escriba una descripción"
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Precio</label>
          <input
            type="number"
            name="price"
            value={paquete.price}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Dias</label>
          <input
            type="number"
            name="days"
            value={paquete.days}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <button className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">
          Añadir Paquete
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
