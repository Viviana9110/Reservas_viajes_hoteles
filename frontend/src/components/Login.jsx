import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const Login = () => {
  const { setShowUserLogin, loginUser, registerUser } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let res;
      if (state === "login") {
        res = await loginUser(email, password);
      } else {
        res = await registerUser(name, email, password, phone);
      }
      if (res?.token) localStorage.setItem("accessToken", res.token);
      if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));
      setShowUserLogin(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={() => setShowUserLogin(false)} className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-5 m-auto items-start p-8 py-10 w-80 sm:w-[380px] rounded-2xl shadow-xl border border-gray-100 bg-white"
      >
        <div className="w-full text-center">
          <p className="text-2xl font-bold text-secondary">
            {state === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {state === "login" ? "Accede a tu cuenta" : "Regístrate para comenzar"}
          </p>
        </div>

        {state === "register" && (
          <>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Nombre</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Tu nombre"
                className="border border-gray-200 rounded-lg w-full p-2.5 mt-1 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">WhatsApp <span className="text-gray-400 font-normal">(para recibir notificaciones)</span></label>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                placeholder="+57 300 000 0000"
                className="border border-gray-200 rounded-lg w-full p-2.5 mt-1 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                type="tel"
              />
            </div>
          </>
        )}

        <div className="w-full">
          <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="correo@ejemplo.com"
            className="border border-gray-200 rounded-lg w-full p-2.5 mt-1 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
            className="border border-gray-200 rounded-lg w-full p-2.5 mt-1 outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-secondary hover:bg-gray-800 transition-all text-white w-full py-2.5 rounded-lg font-medium cursor-pointer disabled:opacity-60"
        >
          {loading ? "Procesando..." : state === "register" ? "Crear Cuenta" : "Iniciar Sesión"}
        </button>

        <p className="text-sm text-gray-500 w-full text-center">
          {state === "register" ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
          <span onClick={() => setState(state === "login" ? "register" : "login")} className="text-primary font-medium cursor-pointer hover:underline">
            {state === "register" ? "Inicia sesión" : "Regístrate"}
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
