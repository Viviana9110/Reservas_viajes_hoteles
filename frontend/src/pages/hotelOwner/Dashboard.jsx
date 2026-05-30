import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

function useCountUp(target, enabled) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;
    started.current = true;
    const duration = 1000;
    const steps = 30;
    let current = 0;
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, enabled]);

  return count;
}

const statsConfig = [
  { title: "Total Hoteles", color: "from-primary to-blue-700", icon: "/src/assets/dashboardIcon.svg", key: "totalHotels", bgPattern: "opacity-5" },
  { title: "Habitaciones", color: "from-emerald-500 to-emerald-700", icon: "/src/assets/listIcon.svg", key: "totalRooms" },
  { title: "Paquetes Turísticos", color: "from-amber-500 to-orange-700", icon: "/src/assets/totalBookingIcon.svg", key: "totalPackages" },
  { title: "Reservas Activas", color: "from-violet-500 to-violet-700", icon: "/src/assets/totalRevenueIcon.svg", key: "activeReservations" },
];

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 },
};

const quickLinks = [
  { label: "Añadir Hotel", path: "/owner/add-hotel", color: "from-primary to-blue-600", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Añadir Habitación", path: "/owner/add-room", color: "from-emerald-500 to-emerald-700", icon: "M3 10h18M4 10V6a2 2 0 012-2h12a2 2 0 012 2v4M4 10v10h16V10" },
  { label: "Añadir Paquete", path: "/owner/add-package", color: "from-amber-500 to-orange-600", icon: "M12 4v16m8-8H4" },
  { label: "Ver Habitaciones", path: "/owner/list-room", color: "from-violet-500 to-violet-700", icon: "M3 12l9-9 9 9M4 10v10h16V10" },
];

const Dashboard = () => {
  const { dashboardStats, fetchDashboardStats } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchDashboardStats();
      setLoading(false);
    };
    load();
  }, [fetchDashboardStats]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const countHotels = useCountUp(dashboardStats?.totalHotels ?? 0, visible && !loading);
  const countRooms = useCountUp(dashboardStats?.totalRooms ?? 0, visible && !loading);
  const countPackages = useCountUp(dashboardStats?.totalPackages ?? 0, visible && !loading);
  const countReservations = useCountUp(dashboardStats?.activeReservations ?? 0, visible && !loading);
  const statsValues = { totalHotels: countHotels, totalRooms: countRooms, totalPackages: countPackages, activeReservations: countReservations };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Bienvenido al Dashboard</h2>
        <p className="text-gray-500 text-sm">Gestiona tus hoteles, habitaciones y paquetes turísticos desde este panel.</p>
      </motion.div>

      <div ref={statsRef}>
        <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsConfig.map((stat) => (
            <motion.div
              key={stat.key}
              variants={item}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-5 text-white shadow-md hover:shadow-lg transition-shadow group`}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-start justify-between relative">
                <div>
                  <p className="text-sm font-medium text-white/80">{stat.title}</p>
                  {loading ? (
                    <div className="mt-2 h-8 w-16 bg-white/20 rounded animate-pulse" />
                  ) : (
                    <motion.p
                      key={statsValues[stat.key]}
                      className="text-3xl font-bold mt-1 tabular-nums"
                    >
                      {statsValues[stat.key]}
                    </motion.p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                  <img src={stat.icon} alt="" className="w-5 h-5 invert brightness-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="font-semibold text-gray-800 mb-1">Accesos Rápidos</h3>
        <p className="text-sm text-gray-500 mb-5">Las herramientas más usadas a un clic de distancia.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <motion.a
              key={link.path}
              href={link.path}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-br ${link.color} text-white rounded-xl p-4 text-sm font-medium hover:opacity-90 transition-all shadow-sm flex flex-col items-center gap-2 text-center`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              {link.label}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
