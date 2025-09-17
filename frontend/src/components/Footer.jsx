import React from 'react'

const Footer = () => {
  return (
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">HotelHub</h3>
                    <p class="text-gray-400">Encuentra las mejores ofertas de hoteles y realiza reservas de forma sencilla y segura.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Enlaces Rápidos</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Inicio</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Hoteles</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Mis Reservas</a></li>
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
                        <p><i class="fas fa-map-marker-alt mr-2"></i> Av. Principal #123, CDMX</p>
                        <p class="mt-2"><i class="fas fa-phone mr-2"></i> +52 55 1234 5678</p>
                        <p class="mt-2"><i class="fas fa-envelope mr-2"></i> info@hotelhub.com</p>
                    </address>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} HotelHub. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer