import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

const ListPackages = () => {
   const { trips, loadingTrips } = useAppContext();
  
    if (loadingTrips) return <p className="text-center py-10 text-gray-500">Cargando viajes...</p>;
  
  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">Paquetes Turísticos</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Nombre</th>
                <th className="px-4 py-3 font-semibold truncate">Destino</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Precio</th>
                <th className="px-4 py-3 font-semibold truncate">Días</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {trips.map((trips) => (
                <tr key={trips._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 truncate">
                    {trips.name}
                  </td>
                  <td className="px-4 py-3">{trips.destination}</td>
                  <td className="px-4 py-3 max-sm:hidden">${trips.price}</td>
                  <td className="px-4 py-3">{trips.days} días</td>
                </tr>
              ))}

              {trips.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No hay paquetes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListPackages;
