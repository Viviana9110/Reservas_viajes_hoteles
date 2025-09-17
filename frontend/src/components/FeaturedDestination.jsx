import { motion } from "framer-motion";
import Title from './Title'
import { Navigate, NavLink, useNavigate } from "react-router-dom";

const FeaturedDestination = () => {
   const destinos = [
    {
      _id: "68c86b946a4880feeccf218e",
      name: "Bogotá Cultural",
      image:
        "https://plus.unsplash.com/premium_photo-1754254982866-367adad1328d?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      image:
        "data:image/jpeg;base64,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",
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
                <NavLink to={`/destination/${destino._id}`} className='px-4 py-2 text-sm font-medium border border-third rounded hover:bg-third transition-all cursor-pointer'>Reservar</NavLink>
            </div>
            </div>
            
          </motion.div>
        ))}
      </div>

      <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}} 
      className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        Ver Mas
      </button>
    </div>
  )
}

export default FeaturedDestination
