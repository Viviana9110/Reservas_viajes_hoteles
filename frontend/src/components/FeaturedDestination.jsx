import { motion } from "framer-motion";
import Title from './Title'
import { Navigate, NavLink, useNavigate } from "react-router-dom";

const FeaturedDestination = () => {
   const destinos = [
    {
      _id: "68c86b946a4880feeccf218e",
      name: "Bogotá Cultural",
      image:
        "https://southamericabackpacker.com/wp-content/uploads/2023/04/Bogota-Sign-Monserrate-1200x800.jpg",
      description:
        "3 días de recorridos por museos, centros históricos y gastronomía.",
      price: 950000,
    },
    {
      _id: "68c882893fbdcb2354aaa001",
      name: "Pueblos Patrimonio de Colombia",
      image:
        "https://images.unsplash.com/photo-1623194419771-c6cbe2e869a4?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Pueblos Patrimonio de Colombia, arquitectura y belleza colonial",
      price: 2970000
    },
    {
      _id: "68c882ee3fbdcb2354aaa003",
      name: "Sorprendente Boyacá",
      image:
        "https://aneia.uniandes.edu.co/wp-content/uploads/2024/08/puente-de-boy.jpg",
      description:
        "Descubre durante 5 días, los lugares más increíbles de Boyaca.",
      price: 1665000,
    },
    {
      _id: "68c8838d3fbdcb2354aaa005",
      name: "Mexico y Cancún",
      image: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/ef90/live/d3367b00-c22b-11ef-aff0-072ce821b6ab.jpg.webp",
      description:
        "Descubre durante 9 días, los lugares más increíbles de Mexico.",
      price: 9900000
    },
    
  ];

  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

      <Title title='Destinos Destacados' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'/>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
        {destinos.map((destino, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={destino.image}
              alt={destino.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 pt-5">              
              <h4 className="font-playfair text-xl font-medium text-gray-800">{destino.name}</h4>
              <p className="flex items-center gap-1 text-sm">{destino.description}</p>
              
              <div className='flex items-center justify-between mt-4'>
                <p><span className='text-xl text-gray-800'>${destino.price}</span></p>
                <NavLink to={`/trips/${destino._id}`} className='px-4 py-2 text-sm font-medium border border-slate-800 rounded hover:bg-slate-500 transition-all cursor-pointer'>Reservar</NavLink>
            </div>
            </div>
            
          </motion.div>
        ))}
      </div>

      <NavLink onClick={()=>{navigate('/trips'); scrollTo(0,0)}} 
      className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        Ver Mas
      </NavLink>
    </div>
  )
}

export default FeaturedDestination
