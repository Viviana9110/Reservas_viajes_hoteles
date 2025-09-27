import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const stats = [
    { title: "Total Hoteles", color: "bg-indigo-500", key: "totalHotels" },
    { title: "Habitaciones", color: "bg-green-500", key: "totalRooms" },
    { title: "Paquetes Turísticos", color: "bg-red-500", key: "totalPackages" },
    { title: "Reservas Activas", color: "bg-yellow-500", key: "activeReservations" },
  ];

  const { dashboardStats, fetchDashboardStats } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDashboardStats();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="p-6">
      {/* Bienvenida */}
      <div className="mt-3 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Bienvenido al Dashboard 👋
        </h2>
        <p className="text-gray-600">
          Desde este panel puedes gestionar tus hoteles, añadir habitaciones y
          revisar todas las reservas.
        </p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md text-white ${stat.color}`}
          >
            <h2 className="text-lg font-semibold">{stat.title}</h2>

            {loading ? (
              // Skeleton loader
              <div className="mt-2 h-8 w-16 bg-white/30 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold mt-2">
                {dashboardStats?.[stat.key] ?? 0}
              </p>
            )}
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Dashboard;
