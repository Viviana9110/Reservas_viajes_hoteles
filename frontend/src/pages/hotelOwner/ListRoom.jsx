import React, { useState } from "react";

const ListRoom = () => {
  const [rooms, setRooms] = useState([
    { number: "101", type: "Suite", price: 120 },
    { number: "102", type: "Estándar", price: 80 },
  ]);

  return (
    <>
     
    <div className="flex-1 py-10 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">Lista de Habitaciones</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">N°</th>
                                <th className="px-4 py-3 font-semibold truncate">Tipo</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Precio</th>
                                <th className="px-4 py-3 font-semibold truncate">Disponible</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {rooms.map((room, index) => (
                                <tr key={index} className="border-t border-gray-500/20">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        
                                        <span className="truncate max-sm:hidden w-full">{room.number}</span>
                                    </td>
                                    <td className="px-4 py-3">{room.type}</td>
                                    <td className="px-4 py-3 max-sm:hidden">${room.price}</td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    
    </>
   
  );
};

export default ListRoom;
