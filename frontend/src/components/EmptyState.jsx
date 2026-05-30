import { assets } from "../assets/assets";

const EmptyState = ({ title = "Sin resultados", description = "No encontramos nada para mostrar.", icon = assets.searchIcon }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <img src={icon} alt="" className="h-16 w-16 opacity-30 mb-4" />
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>
  </div>
);

export default EmptyState;
