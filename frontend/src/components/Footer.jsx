import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const footerLinks = [
  { title: "Enlaces Rápidos", links: [
    { label: "Inicio", to: "/" },
    { label: "Hoteles", to: "/hotels" },
    { label: "Paquetes", to: "/trips" },
  ]},
  { title: "Soporte", links: [
    { label: "FAQ", to: "#" },
    { label: "Políticas de Privacidad", to: "#" },
    { label: "Términos y Condiciones", to: "#" },
    { label: "Ayuda", to: "#" },
  ]},
];

const socialIcons = [
  { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "Twitter", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
];

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 },
};

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 mt-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div variants={fadeUp}>
            <h3 className="text-xl font-bold mb-4">Viajes Tour Colombia</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Encuentra las mejores ofertas de paquetes turísticos y realiza tus reservas de forma sencilla y segura.
            </p>
            <div className="flex gap-3 mt-5">
              {socialIcons.map((icon) => (
                <a
                  key={icon.label}
                  href="#"
                  aria-label={icon.label}
                  className="group w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <svg
                    className="w-4 h-4 fill-gray-400 group-hover:fill-white transition-colors"
                    viewBox="0 0 24 24"
                  >
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={fadeUp}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white transition-colors relative inline-block group/link"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover/link:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <address className="text-gray-400 not-italic text-sm space-y-2">
              <p className="flex items-center gap-2">📍 Calle 22 #23-23 local 104</p>
              <p className="flex items-center gap-2">📞 +57 3203690202</p>
              <p className="flex items-center gap-2">✉️ contacto@viajestourcolombia.com</p>
            </address>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} Viajes Tour Colombia. Todos los derechos reservados.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
