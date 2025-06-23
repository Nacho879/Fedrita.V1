import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart } from 'lucide-react';

const industryLinks = [
  { href: '/gestion-citas-peluquerias', text: 'Peluquerías' },
  { href: '/gestion-citas-barberias', text: 'Barberías' },
  { href: '/gestion-citas-unas', text: 'Centros de uñas' },
  { href: '/gestion-tratamientos-estetica', text: 'Centros de estética' },
  { href: '/gestion-reservas-spa', text: 'Masajistas y Spa' },
  { href: '/gestion-pacientes-psicologos', text: 'Psicólogos' },
  { href: '/gestion-clinica-dental', text: 'Dentistas' },
  { href: '/gestion-pacientes-fisioterapia', text: 'Fisioterapeutas' },
  { href: '/gestion-clinica-fisioterapia', text: 'Clínicas de fisioterapia' },
  { href: '/gestion-clinica-veterinaria', text: 'Veterinarias' },
  { href: '/gestion-clases-yoga-pilates', text: 'Yoga y Pilates' },
  { href: '/gestion-clinica-estetica-laser', text: 'Clínicas de estética láser' },
  { href: '/gestion-citas-tatuajes', text: 'Estudios de tatuajes' },
  { href: '/gestion-pacientes-logopedia', text: 'Gabinetes de Logopedia' },
  { href: '/gestion-pacientes-psicologia-infantil', text: 'Psicología Infantil' },
];

const Footer = () => {
  return (
    <footer className="bg-hub-anthracite text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <span className="font-poppins text-2xl font-bold">Fedrita</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">Fedrita transforma tu negocio con IA: automatizá WhatsApp, gestioná reservas y hacé que todo funcione solo.</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>hola@fedrita.com</span>
              </div>
            </div>
          </div>

          <div>
            <p className="font-poppins text-lg font-semibold mb-4 block">Producto</p>
            <ul className="space-y-3">
              <li><Link to="/#features" className="text-gray-300 hover:text-white transition-colors">Características</Link></li>
              <li><Link to="/#benefits" className="text-gray-300 hover:text-white transition-colors">Beneficios</Link></li>
              <li><Link to="/#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonios</Link></li>
              <li><Link to="/precios" className="text-gray-300 hover:text-white transition-colors">Precios</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-poppins text-lg font-semibold mb-4 block">Empresa</p>
            <ul className="space-y-3">
              <li><Link to="/acerca-de" className="text-gray-300 hover:text-white transition-colors">Acerca de</Link></li>
              <li><Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <p className="font-poppins text-lg font-semibold mb-4 block">Soluciones para cada negocio</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-3">
            {industryLinks.map(link => (
              <li key={link.href}>
                <Link to={link.href} className="text-gray-300 hover:text-white transition-colors">{link.text}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Fedrita. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-hub-coral fill-current" />
              <span>para negocios como el tuyo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;