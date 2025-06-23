import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout, userRole, displayName } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleDashboardClick = () => {
    setIsMenuOpen(false);
    if (userRole === 'admin') {
      navigate('/dashboard');
    } else if (userRole === 'manager') {
      navigate('/dashboard-manager');
    } else if (userRole === 'super_admin') {
      navigate('/super-admin');
    } else if (userRole === 'employee') {
      navigate('/dashboard-empleado');
    } else {
      navigate('/login');
    }
  };

  const navLinks = [
    { to: '/', text: 'Inicio' },
    { to: '/#features', text: 'Características' },
    { to: '/precios', text: 'Precios' },
    { to: '/acerca-de', text: 'Acerca de' },
    { to: '/contacto', text: 'Contacto' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-background/80 backdrop-blur-sm border-b' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
          <span className="font-poppins text-2xl font-bold text-hub-anthracite">Fedrita</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-foreground hover:text-hub-coral transition-colors">
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Button onClick={handleDashboardClick} className="btn-primary">
                Ir al Panel
              </Button>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-hub-coral" />
                <span className="text-sm font-medium text-foreground">
                  {displayName || user.email?.split('@')[0]}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-foreground hover:text-red-500">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link to="/register">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/80 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 pb-4 flex flex-col space-y-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} className="text-foreground hover:text-hub-coral transition-colors text-lg" onClick={() => setIsMenuOpen(false)}>
                    {link.text}
                  </Link>
                ))}
              </nav>
              <div className="border-t pt-4 flex flex-col space-y-4">
                {user ? (
                  <>
                    <Button onClick={handleDashboardClick} className="btn-primary w-full">
                      Ir al Panel
                    </Button>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-hub-coral" />
                          <span className="text-sm font-medium text-foreground">
                            {displayName || user.email?.split('@')[0]}
                          </span>
                        </div>
                        <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-red-500">
                          <LogOut className="w-5 h-5 mr-2" /> Salir
                        </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar sesión</Link>
                    </Button>
                    <Button asChild className="btn-primary w-full">
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>Crear cuenta</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;