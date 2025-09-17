import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, roomCommonData, tripsDummyData} from '../assets/assets'

const TripsDetails = () => {
    const {id} = useParams()
    const [trips, setTrips] = useState(null)
    const [mainImage, setMainImage] = useState(null)

    useEffect(()=>{
       const trips = tripsDummyData.find(trips => trips._id === id)
       trips && setTrips(trips)
       trips && setMainImage(trips.images[0])
    },[])

   
  return trips && (
      <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* Trip Details */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>
            {trips.name}</h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-third rounded-full'>20% OFF</p>
      </div>

      {/* Room Raiting */}
      <div className='flex items-center gap-1 mt-2'>
        <p className='ml-2'>200+ reviews</p>
      </div>

     {/* Room Address */}
      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{trips.destination}</span>
      </div>

    {/* Room Images */}
    <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
            <img src={mainImage} alt="Room Image" 
            className='w-full rounded-xl shadow-lg object-cover'/>
        </div>
        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
            {trips?.images.length > 1 && trips.images.map((image, index)=>(
                <img onClick={()=> setMainImage(image)}
                 key={index} src={image} alt="Room Image" 
                 className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-orange-500'}`}/>
            ))}
        </div>
    </div>

    {/* Room Highlights */}
    <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
            <h1 className='text-3xl md:text-4xl font-playfair'>Una Verdadera Experiencia De Lujo</h1>
            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                {trips.description}
            </div>
            
        </div>
         {/* Room Price */}
        <p className='text-2xl font-medium'>${trips.price}</p>
    </div>

    {/* CheckIn CheckOut Form */}
     <form className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>

        <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>

            <div className='flex flex-col'>
                <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                <input type="date" id='checkInDate' placeholder='Check-In' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
            </div>
            <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
            <div className='flex flex-col'>
                <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                <input type="date" id='checkOutDate' placeholder='Check-Out' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required/>
            </div>
            <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
            
        </div>

        <button type='submit' className='bg-secondary hover:bg-primary active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
            Ver Disponibilidad
        </button>
     </form>

     {/* Common Specifications */}
    <div className='mt-25 space-y-4'>
        {roomCommonData.map((spec, index)=>(
            <div key={index} className='flex items-start gap-2'>
                <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5'/>
                <div>
                    <p className='text-base'>{spec.title}</p>
                    <p className='text-gray-500'>{spec.description}</p>
                </div>
            </div>
        ))}
    </div>

     <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p>★ LA SEPARACIÓN DEL CUPO: SE HACE POR PERSONA.CON EL 50%
           ★ SE GARANTIZA LA SALIDA CON UN MÍNIMO DE 16 PASAJEROS
           ★ LA HABITACIÓN DOBLE IMPLICA UNA INVERSIÓN POR PERSONA DE $ 90.000</p>
    </div>

    {/* Hosted by  */}
    <div className='flex flex-col items-start gap-4'>
        <div className='flex gap-4'>
            <img src={assets.logoTour} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
            <div>
                <p className='text-lg md:text-xl'>Viajes Tour Colombia</p>
                <div className='flex items-center mt-1'>
                    <p className='ml-2'>200+ reviews</p>
                </div>
            </div>
        </div>
        <button className='px-6 py-2.5 mt-4 rounded text-white bg-secondary hover:bg-primary transition-all cursor-pointer'>Contact Now</button>
    </div>


    </div>
  )
}

export default TripsDetails
