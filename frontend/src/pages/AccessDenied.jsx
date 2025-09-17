import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">🚫 Acceso Denegado</h1>
      <p className="text-gray-600 mb-6">
        No tienes permisos para acceder a esta página.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default AccessDenied;
