import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { NavLink, useNavigate } from "react-router-dom";

const Trips = () => {

    const { trips, loadingTrips } = useAppContext();
    const navigate = useNavigate();
    
    if (loadingTrips) return <p className="text-center">Cargando viajes...</p>;

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
         <div>
          <div className='flex flex-col items-start text-left'>
                <h1 className='font-playfair text-4xl md:text-[40px]'>Paquetes de Viaje</h1>
                <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
            </div>
    
            {trips.map((trip) => (
            <div key={trip._id} className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0">
              <div className='md:w-1/2 flex flex-col gap-2'>
                <h2 className="text-xl font-bold mb-2">{trip.name}</h2>
                <p className="text-gray-600">
                  {trip.description}
                </p>          
              </div>
              
              <p className="text-sm text-gray-500">{trip.destination}</p>
              <p className="text-sm text-gray-500">{trip.price}</p>
              <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                <p className="text-sm text-gray-500">{trip.days}</p>
    
              </div>
    
        
              <NavLink to={`/trips/${trip._id}`} className="px-6 py-2 active:scale-95 transition bg-blue-500 rounded text-white shadow-lg shadow-blue-500/30 text-sm font-medium">
               
                  Ver Mas
                
              </NavLink>
            </div>
          ))}
         </div>
         
        </div>
  )
}

export default Trips