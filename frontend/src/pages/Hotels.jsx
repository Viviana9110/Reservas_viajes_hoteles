import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { NavLink } from "react-router-dom";

const Hotels = () => {
  const { hotels, loadingHotels } = useAppContext();

  if (loadingHotels) return <p className="text-center">Cargando hoteles...</p>;

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
     <div>
      <div className='flex flex-col items-start text-left'>
            <h1 className='font-playfair text-4xl md:text-[40px]'>Hoteles</h1>
            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
        </div>

        {hotels.map((hotel) => (
        <div key={hotel._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
          <div className='md:w-1/2 flex flex-col gap-2'>
            <h1 className="text-xl font-bold mb-2">{hotel.name}</h1>
            <p className="text-gray-600">
              {hotel.location?.city}
            </p>   
            <p className="text-sm text-gray-500">{hotel.location?.address}</p>
            <p className="text-sm text-gray-500">{hotel.description}</p>
          </div>
          
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
              <p className="text-sm text-gray-500">{hotel.amenities}</p>
            </div>            
          </div>


          <p className="text-xl font-medium text-gray-700">
            {hotel.pricePerNight
              ? `$${hotel.pricePerNight} / noche`
              : "Precio no disponible"}
          </p>

          <NavLink to={`/rooms/${hotel._id}`}>
           <button className="px-6 py-2 active:scale-95 transition bg-blue-500 rounded text-white shadow-lg shadow-blue-500/30 text-sm font-medium">
              Ver Habitaciones
            </button>
          </NavLink>
        </div>
      ))}
     </div>
     
    </div>
  );
};

export default Hotels;
