// context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isOwner, settIsOwner] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Cargar usuario al iniciar
  const fetchUser = async () => {
    try {
      if (!token) {
        setUser(null);
        return;
      }

      const { data } = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  // ✅ Login
  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setShowUserLogin(false);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  // ✅ Registro con login automático
  const registerUser = async (name, email, password) => {
    try {
      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setShowUserLogin(false);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar usuario");
    }
  };

  // ✅ Logout
  const logoutUser = async () => {
    try {
      if (token) {
        await axios.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.warn("Logout falló en el servidor, limpiando sesión local...");
    } finally {
      // limpiar sesión local siempre
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      navigate("/"); // 👈 te mando al home directamente
    }
  };

  // ✅ Hoteles
  const fetchHotels = async () => {
    try {
      setLoadingHotels(true);
      const { data } = await axios.get("/hotels");
      setHotels(data);
    } catch (error) {
      console.error("Error al obtener hoteles:", error.response?.data || error.message);
    } finally {
      setLoadingHotels(false);
    }
  };

  // ✅ Viajes
  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      const { data } = await axios.get("/trips");
      setTrips(data);
    } catch (error) {
      console.error("Error al obtener los viajes:", error.response?.data || error.message);
    } finally {
      setLoadingTrips(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchTrips();
  }, []);

  const value = {
    navigate,
    user,
    token,
    setUser,
    isOwner,
    settIsOwner,
    showUserLogin,
    setShowUserLogin,
    loadingUser,
    logoutUser, // 👈 listo para usarse en cualquier parte de la app
    hotels,
    setHotels,
    fetchHotels,
    loadingHotels,
    trips,
    setTrips,
    fetchTrips,
    loadingTrips,
    loginUser,
    registerUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
