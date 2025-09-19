import React from 'react'

const Footer = () => {
  return (
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">Viajes Tour Colombia</h3>
                    <p class="text-gray-400">Encuentra las mejores ofertas de paquetes turísticos y realiza tus reservas de forma sencilla y segura.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Enlaces Rápidos</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Inicio</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Hoteles</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Paquetes</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Contacto</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Soporte</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition">FAQ</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Políticas de Privacidad</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Términos y Condiciones</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Ayuda</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Contacto</h4>
                    <address class="text-gray-400 not-italic">
                        <p>Calle 22 #23-23 local 104</p>
                        <p class="mt-2">+57 3203690202</p>
                        <p class="mt-2">contacto@viajestourcolombia.com</p>
                    </address>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Viajes Tour Colombia. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer