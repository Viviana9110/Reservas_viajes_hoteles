import "dotenv/config";
import mongoose from "mongoose";
import Destination from "./models/Destination.js";

const destinations = [
  {
    name: "Cartagena",
    description: "Ciudad amurallada frente al mar Caribe, con calles coloniales, playas paradisíacas y una vida nocturna vibrante.",
    image: "https://picsum.photos/seed/cartagena/800/600",
    region: "Caribe",
    tours: [
      { name: "Tour Ciudad Amurallada", description: "Recorrido a pie por las calles coloniales, plaza de los coches, castillo de San Felipe.", price: 85000, duration: "3 horas", category: "Cultura" },
      { name: "Islas del Rosario", description: "Paseo en lancha al archipiélago, snorkel en aguas cristalinas y almuerzo típico.", price: 180000, duration: "Día completo", category: "Naturaleza" },
      { name: "Chiva Rumbera", description: "Fiesta sobre ruedas con música en vivo, baile y parada en la bahía iluminada.", price: 70000, duration: "4 horas", category: "Diversión" },
      { name: "Buceo en Isla Barú", description: "Inmersión guiada para explorar arrecifes de coral y vida marina.", price: 220000, duration: "Medio día", category: "Aventura" },
    ],
  },
  {
    name: "Medellín",
    description: "La ciudad de la eterna primavera, innovadora, cultural y rodeada de montañas verdes.",
    image: "https://picsum.photos/seed/medellin/800/600",
    region: "Andina",
    tours: [
      { name: "Comuna 13 y Graffiti", description: "Recorrido urbano con historia, arte callejero y escaleras eléctricas.", price: 65000, duration: "3 horas", category: "Cultura" },
      { name: "Guatapé y Peñón", description: "Escalar la piedra de 700 escalones y navegar el embalse.", price: 120000, duration: "Día completo", category: "Naturaleza" },
      { name: "Tour Gastronómico", description: "Degustación de bandeja paisa, arepas, empanadas y dulces típicos.", price: 90000, duration: "4 horas", category: "Gastronomía" },
      { name: "Parque Arví", description: "Caminata ecológica, picnic y avistamiento de aves en el bosque nativo.", price: 75000, duration: "Medio día", category: "Naturaleza" },
    ],
  },
  {
    name: "Bogotá",
    description: "Capital cultural y gastronómica de Colombia, con museos de clase mundial y arquitectura colonial.",
    image: "https://picsum.photos/seed/bogota/800/600",
    region: "Andina",
    tours: [
      { name: "Museo del Oro", description: "La colección de orfebrería precolombina más grande del mundo.", price: 45000, duration: "2 horas", category: "Cultura" },
      { name: "Monserrate", description: "Ascenso al cerro, vista panorámica de la ciudad y la iglesia del Señor Caído.", price: 55000, duration: "3 horas", category: "Cultura" },
      { name: "La Candelaria", description: "Recorrido por el barrio colonial con casas de colores, museos y cafés.", price: 40000, duration: "3 horas", category: "Cultura" },
      { name: "Catedral de Sal Zipaquirá", description: "Maravillosa catedral subterránea tallada en las minas de sal.", price: 110000, duration: "Medio día", category: "Cultura" },
    ],
  },
  {
    name: "Eje Cafetero",
    description: "Montañas verdes, fincas cafeteras, termales y el mejor café del mundo.",
    image: "https://picsum.photos/seed/eje-cafetero/800/600",
    region: "Andina",
    tours: [
      { name: "Parque del Café", description: "Atracciones mecánicas, espectáculos culturales y plantaciones de café.", price: 95000, duration: "Día completo", category: "Diversión" },
      { name: "Valle del Cocora", description: "Caminata entre palmas de cera de 60m, las más altas del mundo.", price: 60000, duration: "Medio día", category: "Naturaleza" },
      { name: "Termales Santa Rosa", description: "Aguas termales rodeadas de bosque nativo, perfecto para relajarse.", price: 55000, duration: "4 horas", category: "Relax" },
      { name: "Finca Cafetera", description: "Recorrido interactivo: recolección, tostión y catación del café.", price: 70000, duration: "3 horas", category: "Cultura" },
    ],
  },
  {
    name: "San Andrés",
    description: "Isla de siete colores, mar Caribe cristalino, cultura raizal y ritmo de reggae.",
    image: "https://picsum.photos/seed/san-andres/800/600",
    region: "Caribe",
    tours: [
      { name: "Johnny Cay", description: "Isla de arena blanca y palmeras, ideal para snorkel y almuerzo típico.", price: 130000, duration: "Medio día", category: "Naturaleza" },
      { name: "Hoyos Sopladores", description: "Formaciones rocosas donde el mar expulsa chorros de agua.", price: 50000, duration: "2 horas", category: "Naturaleza" },
      { name: "Paseo en Golf Cart", description: "Recorre la isla en carro de golf, visita al faro y playas escondidas.", price: 160000, duration: "4 horas", category: "Diversión" },
      { name: "Snorkel en la Piscinita", description: "Aguas cristalinas llenas de peces de colores y formaciones coralinas.", price: 80000, duration: "2 horas", category: "Aventura" },
    ],
  },
  {
    name: "Santa Marta",
    description: "Playas doradas, Sierra Nevada de fondo, historia Tayrona y ecoturismo.",
    image: "https://picsum.photos/seed/santa-marta/800/600",
    region: "Caribe",
    tours: [
      { name: "Parque Tayrona", description: "Senderismo hasta playas vírgenes como Cabo San Juan del Guía.", price: 75000, duration: "Día completo", category: "Naturaleza" },
      { name: "Minca", description: "Pueblo de montaña con cascadas, café artesanal y miradores.", price: 65000, duration: "Medio día", category: "Naturaleza" },
      { name: "Ciudad Perdida", description: "Trekking de 4 días a la ciudad Tayrona más importante.", price: 850000, duration: "4 días", category: "Aventura" },
      { name: "Rodadero y Acuario", description: "Playa principal y acuario con especies marinas del Caribe.", price: 55000, duration: "Medio día", category: "Diversión" },
    ],
  },
  {
    name: "San Gil",
    description: "Capital del deporte extremo en Colombia, ríos, cañones y adrenalina pura.",
    image: "https://picsum.photos/seed/san-gil/800/600",
    region: "Andina",
    tours: [
      { name: "Rafting Río Suárez", description: "Aguas bravas clase III-IV, 3 horas de adrenalina extrema.", price: 120000, duration: "Medio día", category: "Aventura" },
      { name: "Parapente Chicamocha", description: "Vuelo en tándem sobre el cañón más grande de Colombia.", price: 250000, duration: "30 min", category: "Aventura" },
      { name: "Espeleología", description: "Exploración de cuevas subterráneas con formaciones milenarias.", price: 95000, duration: "3 horas", category: "Aventura" },
      { name: "Bungee Jumping", description: "Salto desde puente colgante a 80m de altura sobre el río.", price: 110000, duration: "2 horas", category: "Aventura" },
    ],
  },
  {
    name: "Leticia",
    description: "Puerta de entrada a la Amazonía colombiana, selva exuberante y biodiversidad única.",
    image: "https://picsum.photos/seed/leticia/800/600",
    region: "Amazonía",
    tours: [
      { name: "Selva Amazónica", description: "Caminata guiada por la selva con avistamiento de fauna y flora.", price: 150000, duration: "Medio día", category: "Naturaleza" },
      { name: "Avistamiento de Delfines", description: "Navegación por el río Amazonas para ver delfines rosados.", price: 130000, duration: "3 horas", category: "Naturaleza" },
      { name: "Comunidad Indígena", description: "Visita a la comunidad Tikuna, artesanías y danzas tradicionales.", price: 80000, duration: "4 horas", category: "Cultura" },
      { name: "Safari Nocturno", description: "Exploración nocturna para avistar caimanes, ranas y insectos.", price: 110000, duration: "3 horas", category: "Aventura" },
    ],
  },
];

const seedDestinations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Destination.deleteMany({});
    await Destination.insertMany(destinations);
    console.log("✅ Destinos sembrados exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error sembrando destinos:", error);
    process.exit(1);
  }
};

seedDestinations();
