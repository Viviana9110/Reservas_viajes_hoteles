import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const MotionLink = motion(Link);
import dashboardIcon from "../../assets/dashboardIcon.svg";
import listIcon from "../../assets/listIcon.svg";
import totalBookingIcon from "../../assets/totalBookingIcon.svg";
import totalRevenueIcon from "../../assets/totalRevenueIcon.svg";

const statsConfig = [
  { title: "Total Hoteles", gradient: "from-primary to-emerald-deep", icon: dashboardIcon, key: "totalHotels" },
  { title: "Habitaciones", gradient: "from-emerald-mid to-emerald-deep", icon: listIcon, key: "totalRooms" },
  { title: "Paquetes Turísticos", gradient: "from-terracotta to-terracotta-dark", icon: totalBookingIcon, key: "totalPackages" },
  { title: "Reservas Activas", gradient: "from-gold to-amber-700", icon: totalRevenueIcon, key: "activeReservations" },
];

const quickLinks = [
  { label: "Añadir Hotel", path: "/owner/add-hotel", gradient: "from-primary to-emerald-deep", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Añadir Habitación", path: "/owner/add-room", gradient: "from-emerald-mid to-emerald-deep", icon: "M3 10h18M4 10V6a2 2 0 012-2h12a2 2 0 012 2v4M4 10v10h16V10" },
  { label: "Añadir Paquete", path: "/owner/add-package", gradient: "from-terracotta to-terracotta-dark", icon: "M12 4v16m8-8H4" },
  { label: "Ver Habitaciones", path: "/owner/list-room", gradient: "from-gold to-amber-700", icon: "M3 12l9-9 9 9M4 10v10h16V10" },
];


const StatSkeleton = () => (
  <div className="rounded-2xl bg-white border border-gray-100 p-5">
    <div className="skeleton h-4 w-24 mb-3" />
    <div className="skeleton h-8 w-16" />
  </div>
);

const Dashboard = () => {
  const { dashboardStats, fetchDashboardStats } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [extendedStats, setExtendedStats] = useState(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    await fetchDashboardStats();
    try {
      const { default: axios } = await import("axios");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard`
      );
      setExtendedStats(data);
    } catch {
      // extended data is optional
    }
    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }, [fetchDashboardStats]);

  useEffect(() => {
    load();
  }, [load]);

  const isEmpty = !loading && dashboardStats?.totalHotels === 0 && dashboardStats?.totalRooms === 0 && dashboardStats?.totalPackages === 0;

  const alerts = extendedStats?.alerts || { upcomingCheckins: [], lowRoomHotels: 0 };

  const recentBookings = extendedStats?.recentBookings || [];
  const bookingTrend = extendedStats?.bookingTrend || [];

  const maxTrend = Math.max(...bookingTrend.map((t) => t.count), 1);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-start justify-between gap-4"
      >
        <div>
          <h2 className="font-playfair text-xl md:text-2xl font-bold text-coffee">
            Bienvenido al Dashboard
          </h2>
          <p className="text-coffee-light text-sm mt-1">
            Gestiona tus hoteles, habitaciones y paquetes turísticos desde este panel.
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-coffee-light hover:text-coffee border border-gray-200 rounded-full hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
        >
          <svg
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </motion.div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="font-semibold text-coffee text-lg mb-1">
            Aún no tienes contenido
          </h3>
          <p className="text-coffee-light text-sm mb-6 max-w-sm mx-auto">
            Crea tu primer hotel, agrega habitaciones y paquetes turísticos para empezar a recibir reservas.
          </p>
          <Link
            to="/owner/add-hotel"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Crear mi primer hotel
          </Link>
        </motion.div>
      ) : (
        <>
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <StatSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statsConfig.map((stat) => {
                  const value = dashboardStats?.[stat.key] ?? 0;
                  return (
                    <div
                      key={stat.key}
                      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 text-white shadow-md hover:shadow-lg transition-shadow group`}
                    >
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="flex items-start justify-between relative">
                        <div>
                          <p className="text-sm font-medium text-white/80">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-bold mt-1 tabular-nums">
                            {value}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                          <img
                            src={stat.icon}
                            alt=""
                            className="w-5 h-5 invert brightness-200"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-coffee">Últimas Reservas</h3>
                <span className="text-xs text-coffee-light">
                  {recentBookings.length} recientes
                </span>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-sm text-coffee-light py-6 text-center">
                  Aún no hay reservas registradas.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left font-medium text-coffee-light pb-2 pr-3">
                          Huésped
                        </th>
                        <th className="text-left font-medium text-coffee-light pb-2 pr-3">
                          Hotel
                        </th>
                        <th className="text-left font-medium text-coffee-light pb-2 pr-3 hidden sm:table-cell">
                          Entrada
                        </th>
                        <th className="text-left font-medium text-coffee-light pb-2 hidden sm:table-cell">
                          Salida
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr
                          key={b._id}
                          className="border-b border-gray-50 last:border-0"
                        >
                          <td className="py-2.5 pr-3">
                            <span className="font-medium text-coffee">
                              {b.userName}
                            </span>
                            <span className="text-coffee-light block text-xs">
                              {b.userEmail}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-coffee">
                            {b.hotelName}
                          </td>
                          <td className="py-2.5 pr-3 text-coffee-light hidden sm:table-cell">
                            {new Date(b.checkIn).toLocaleDateString("es-ES")}
                          </td>
                          <td className="py-2.5 text-coffee-light hidden sm:table-cell">
                            {new Date(b.checkOut).toLocaleDateString("es-ES")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-coffee mb-4">
                Reservas por Mes
              </h3>
              {bookingTrend.length === 0 ? (
                <p className="text-sm text-coffee-light py-6 text-center">
                  Sin datos de reservas aún.
                </p>
              ) : (
                <div className="flex items-end gap-2 h-32">
                  {bookingTrend.map((t) => (
                    <div
                      key={t.month}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-medium text-coffee-light">
                        {t.count}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-primary to-emerald-soft transition-all hover:opacity-80"
                        style={{
                          height: `${(t.count / maxTrend) * 100}%`,
                          minHeight: t.count > 0 ? "4px" : "0",
                        }}
                      />
                      <span className="text-[10px] text-coffee-light">
                        {t.month.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {(alerts.upcomingCheckins.length > 0 || alerts.lowRoomHotels > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 space-y-3"
            >
              <h3 className="font-semibold text-coffee">Alertas</h3>
              {alerts.upcomingCheckins.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span className="text-amber-800">
                    <strong>{a.userName}</strong> tiene check-in hoy en{" "}
                    <strong>{a.hotelName}</strong>
                  </span>
                </div>
              ))}
              {alerts.lowRoomHotels > 0 && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-red-800">
                    <strong>{alerts.lowRoomHotels}</strong>{" "}
                    {alerts.lowRoomHotels === 1
                      ? "hotel tiene"
                      : "hoteles tienen"}{" "}
                    menos de 3 habitaciones disponibles.
                  </span>
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h3 className="font-semibold text-coffee mb-1">Accesos Rápidos</h3>
            <p className="text-sm text-coffee-light mb-5">
              Las herramientas más usadas a un clic de distancia.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link) => (
                <MotionLink
                  key={link.path}
                  to={link.path}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`bg-gradient-to-br ${link.gradient} text-white rounded-xl p-4 text-sm font-medium hover:opacity-90 transition-all shadow-sm flex flex-col items-center gap-2 text-center`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={link.icon}
                    />
                  </svg>
                  {link.label}
                </MotionLink>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
