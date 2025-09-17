import React from "react";

const Dashboard = () => {
  // ⚡ Aquí luego puedes reemplazar los números por datos reales de tu backend
  const stats = [
    { title: "Total Hoteles", value: 5, color: "bg-indigo-500" },
    { title: "Habitaciones", value: 28, color: "bg-green-500" },
    { title: "Reservas Activas", value: 12, color: "bg-yellow-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Panel de Administración
      </h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md text-white ${stat.color}`}
          >
            <h2 className="text-lg font-semibold">{stat.title}</h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bienvenida */}
      <div className="mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Bienvenido al Dashboard 👋
        </h2>
        <p className="text-gray-600">
          Desde este panel puedes gestionar tus hoteles, añadir habitaciones y
          revisar todas las reservas.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
