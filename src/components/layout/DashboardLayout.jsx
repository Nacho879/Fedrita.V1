import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    BarChart3, 
    LogOut, 
    Building, 
    Briefcase,
    FileClock,
    FileUp,
    Settings,
    MessageSquare,
    Scissors,
    Wallet,
    Clock,
    FileDown,
    UserPlus,
    CalendarPlus,
    UserCog,
    Bell,
    LifeBuoy,
    FileText,
    Sun,
    Menu,
    X,
    Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ href, label, icon: Icon, disabled, onClick }) => {
    const location = useLocation();
    const isActive = !disabled && (location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href)));

    const linkClasses = cn(
        'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
        isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        disabled && 'opacity-50 cursor-not-allowed'
    );

    const content = (
        <>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3">{label}</span>
        </>
    );

    if (disabled) {
        return <span className={linkClasses}>{content}</span>;
    }

    return (
        <Link to={href} className={linkClasses} onClick={onClick}>
            {content}
        </Link>
    );
};

const SidebarContent = ({ onLinkClick }) => {
    const { logout, userRole, managedSalon } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLinkClick) onLinkClick();
        if (logout) {
            logout();
        }
        navigate('/login');
    };

    const adminLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/mis-salones', label: 'Locales', icon: Building },
        { href: '/mis-empleados', label: 'Empleados', icon: Users },
        { href: '/mis-citas', label: 'Citas', icon: Calendar },
        { href: '/mis-clientes', label: 'Clientes', icon: Briefcase },
        { href: '/metricas-empresa', label: 'Métricas', icon: BarChart3 },
        { href: '/fichajes-empresa', label: 'Fichajes', icon: FileClock },
        { href: '/suscripciones', label: 'Suscripciones', icon: Wallet },
    ];

    const managerLinks = [
        { href: '/dashboard-manager', label: 'Dashboard', icon: LayoutDashboard },
        { href: `/salon/${managedSalon?.id}/agenda`, label: 'Agenda', icon: Calendar, disabled: !managedSalon?.id },
        { href: '/empleados-salon', label: 'Equipo', icon: Users },
        { href: '/citas-salon', label: 'Citas', icon: Calendar },
        { href: '/clientes-salon', label: 'Clientes', icon: Briefcase },
        { href: `/salon/${managedSalon?.id}/asistente`, label: 'Asistente IA', icon: Bot, disabled: !managedSalon?.id },
        { href: '/fichaje', label: 'Fichaje', icon: Clock },
        { href: '/fichajes-salon', label: 'Fichajes', icon: FileClock },
        { href: '/gestionar-documentos', label: 'Documentos Equipo', icon: FileUp },
        { href: '/mis-documentos', label: 'Mis Documentos', icon: FileDown },
        { href: '/gestionar-descansos', label: 'Ausencias Equipo', icon: Bell },
        { href: '/solicitar-descanso', label: 'Solicitar Ausencia', icon: CalendarPlus },
    ];

    const employeeLinks = [
        { href: '/dashboard-empleado', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/mi-agenda', label: 'Mi Agenda', icon: Calendar, disabled: !managedSalon?.id },
        { href: '/fichaje', label: 'Mi Fichaje', icon: Clock },
        { href: '/mis-fichajes', label: 'Historial Fichajes', icon: FileClock },
        { href: '/mis-documentos', label: 'Mis Documentos', icon: FileText },
        { href: '/solicitar-descanso', label: 'Solicitar Descanso', icon: Sun },
    ];

    let links = [];
    if (userRole === 'admin') {
        links = adminLinks;
    } else if (userRole === 'manager') {
        links = managerLinks;
    } else if (userRole === 'employee') {
        links = employeeLinks;
    }

    return (
        <div className="w-64 flex-shrink-0 bg-white border-r flex flex-col h-full">
            <div className="h-20 flex items-center justify-center px-4 border-b">
                <Link to="/" className="flex items-center space-x-2" onClick={onLinkClick}>
                    <span className="font-poppins text-2xl font-bold text-hub-anthracite">Fedrita</span>
                </Link>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                {links.map(link => (
                    <SidebarLink key={link.href} {...link} onClick={onLinkClick} />
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900" onClick={handleLogout}>
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
};

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <div className="hidden lg:block">
                <SidebarContent />
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full z-50 lg:hidden"
                        >
                            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="lg:hidden flex items-center justify-between bg-white border-b h-20 px-4 sm:px-6">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="font-poppins text-2xl font-bold text-hub-anthracite">Fedrita</span>
                    </Link>
                    <div className="w-10"></div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;