import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import {
    MoreHorizontal, Shield, Search, Trash2, Play, Pause, Edit, LogOut,
    DollarSign, Briefcase, TrendingUp, Target, Building, Users, Clock,
    BarChart2, PieChart as PieChartIcon, BrainCircuit, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const mockSalonsData = [
    { id: 1, name: 'Belleza Total', company: 'Estilo Corp', signupDate: subDays(new Date(), 30), lastActivity: subDays(new Date(), 1), appointments: 45, appointmentsUsed: 48, llm: 'GPT-4', status: 'Active', plan: '50 citas', planPrice: 49.99, paymentStatus: 'Pagado', totalBilled: 49.99 },
    { id: 2, name: 'Corte & Estilo', company: 'Beauty Group', signupDate: subDays(new Date(), 90), lastActivity: subDays(new Date(), 10), appointments: 150, appointmentsUsed: 150, llm: 'Gemini', status: 'Impago', plan: '200 citas', planPrice: 99.99, paymentStatus: 'Impago', totalBilled: 99.99 },
    { id: 3, name: 'Glamour Lounge', company: 'Estilo Corp', signupDate: subDays(new Date(), 15), lastActivity: subDays(new Date(), 2), appointments: 25, appointmentsUsed: 30, llm: 'DeepSeek', status: 'Trial', plan: '50 citas', planPrice: 0, paymentStatus: 'N/A', totalBilled: 0 },
    { id: 4, name: 'The Barber Club', company: 'MenZone', signupDate: subDays(new Date(), 180), lastActivity: subDays(new Date(), 35), appointments: 88, appointmentsUsed: 88, llm: 'GPT-4', status: 'Suspendido', plan: '100 citas', planPrice: 79.99, paymentStatus: 'Pagado', totalBilled: 79.99 },
    { id: 5, name: 'Nails & Spa', company: 'Beauty Group', signupDate: subDays(new Date(), 60), lastActivity: subDays(new Date(), 3), appointments: 210, appointmentsUsed: 255, llm: 'Gemini', status: 'Active', plan: '300 citas', planPrice: 149.99, paymentStatus: 'Pagado', totalBilled: 149.99 },
    { id: 6, name: 'Lashes & Co', company: 'Beauty Group', signupDate: subDays(new Date(), 45), lastActivity: subDays(new Date(), 5), appointments: 63, appointmentsUsed: 63, llm: 'GPT-4', status: 'Active', plan: '50 citas', planPrice: 49.99, paymentStatus: 'Pagado', totalBilled: 49.99 }
];

const plans = [
    { name: '50 citas', value: '50', price: 49.99 },
    { name: '100 citas', value: '100', price: 79.99 },
    { name: '200 citas', value: '200', price: 99.99 },
    { name: '300 citas', value: '300', price: 149.99 },
    { name: '500 citas', value: '500', price: 199.99 },
];

const aiConsumptionData = [
  { name: 'GPT-4', value: 400, color: '#4A90E2' },
  { name: 'DeepSeek', value: 300, color: '#50E3C2' },
  { name: 'Gemini', value: 300, color: '#F5A623' },
];

const salonStatusData = [
    { name: 'Activos', value: 3, color: '#28a745' },
    { name: 'Impagos', value: 1, color: '#dc3545' },
    { name: 'Trial', value: 1, color: '#ffc107' },
    { name: 'Suspendidos', value: 1, color: '#6c757d' },
];

const getStatusBadge = (status) => {
    switch (status) {
        case 'Active': return <Badge variant="approved">Activo</Badge>;
        case 'Impago': return <Badge variant="destructive">Impago</Badge>;
        case 'Trial': return <Badge variant="pending">Trial</Badge>;
        case 'Suspendido': return <Badge>Suspendido</Badge>;
        case 'Pagado': return <Badge variant="approved">Pagado</Badge>;
        case 'N/A': return <Badge variant="outline">N/A</Badge>;
        default: return <Badge>{status}</Badge>;
    }
};

const SectionCard = ({ title, description, children, className = '' }) => (
    <Card className={className}>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const SuperAdminDashboard = () => {
    const { logout } = useAuth();
    const [salons, setSalons] = useState(mockSalonsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSalon, setSelectedSalon] = useState(null);
    const [isSuspendAlertOpen, setSuspendAlertOpen] = useState(false);
    const [isReactivateAlertOpen, setReactivateAlertOpen] = useState(false);
    const [isChangePlanDialogOpen, setChangePlanDialogOpen] = useState(false);
    const [newPlan, setNewPlan] = useState('');
    const { toast } = useToast();

    const filteredSalons = useMemo(() => {
        return salons.filter(salon => 
            salon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            salon.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [salons, searchTerm]);
    
    const businessMetrics = useMemo(() => {
        const paidSalons = salons.filter(s => s.status === 'Active' || s.paymentStatus === 'Pagado');
        const totalMonthlyRevenue = paidSalons.reduce((acc, s) => acc + s.planPrice, 0);
        return {
            totalMonthlyRevenue: totalMonthlyRevenue,
            totalHistoricalRevenue: 125340.50,
            topSalons: [...salons].sort((a,b) => b.appointments - a.appointments).slice(0, 5),
            overPlanSalons: salons.filter(s => {
                const planLimit = parseInt(s.plan.split(' ')[0]);
                return s.appointmentsUsed > planLimit;
            }),
            totalCompanies: new Set(salons.map(s => s.company)).size,
            totalSalons: salons.length,
            totalEmployees: 237,
        };
    }, [salons]);

    const handleSuspend = () => {
        setSalons(salons.map(s => s.id === selectedSalon.id ? { ...s, status: 'Suspendido' } : s));
        toast({ title: "Salón suspendido", description: `${selectedSalon.name} ha sido suspendido.` });
        setSuspendAlertOpen(false);
    };

    const handleReactivate = () => {
        setSalons(salons.map(s => s.id === selectedSalon.id ? { ...s, status: 'Active', paymentStatus: 'Pagado' } : s));
        toast({ title: "Salón reactivado", description: `${selectedSalon.name} ha sido reactivado.` });
        setReactivateAlertOpen(false);
    };

    const handleChangePlan = () => {
        if (!newPlan) return;
        const selectedPlanData = plans.find(p => p.value === newPlan);
        setSalons(salons.map(s => s.id === selectedSalon.id ? { ...s, plan: selectedPlanData.name, planPrice: selectedPlanData.price } : s));
        toast({ title: "Plan actualizado", description: `El plan de ${selectedSalon.name} se cambió a ${selectedPlanData.name}.` });
        setChangePlanDialogOpen(false);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
                <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
                    <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-bold">Fedrita Super Admin</span>
                    </a>
                </nav>
                 <Button variant="outline" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Cerrar Sesión</span>
                </Button>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        <SectionCard title="Ingresos del Mes" className="xl:col-span-2">
                           <p className="text-4xl font-bold text-green-600">${businessMetrics.totalMonthlyRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                           <p className="text-xs text-muted-foreground">+20.1% vs mes anterior</p>
                        </SectionCard>
                        <SectionCard title="Ingresos Históricos">
                           <p className="text-2xl font-bold">${businessMetrics.totalHistoricalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                        </SectionCard>
                         <SectionCard title="Nuevas Empresas (Mes)">
                           <p className="text-2xl font-bold">12</p>
                        </SectionCard>
                        <SectionCard title="Nuevos Salones (Mes)">
                           <p className="text-2xl font-bold">28</p>
                        </SectionCard>
                         <SectionCard title="Conversión IA">
                            <p className="text-2xl font-bold">12.5%</p>
                            <p className="text-xs text-muted-foreground">Mensajes a reservas</p>
                        </SectionCard>
                    </div>
                </motion.div>
                
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="xl:col-span-2 grid gap-4 md:gap-8">
                        <SectionCard title="Estado Global del Sistema" className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid gap-4" description="Métricas totales de la plataforma.">
                            <div className="flex items-center space-x-3 rounded-lg border p-4">
                               <Building className="h-6 w-6 text-primary" />
                               <div>
                                  <p className="text-sm text-muted-foreground">Empresas</p>
                                  <p className="text-xl font-bold">{businessMetrics.totalCompanies}</p>
                               </div>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border p-4">
                               <Briefcase className="h-6 w-6 text-primary" />
                               <div>
                                  <p className="text-sm text-muted-foreground">Salones</p>
                                  <p className="text-xl font-bold">{businessMetrics.totalSalons}</p>
                               </div>
                            </div>
                             <div className="flex items-center space-x-3 rounded-lg border p-4">
                               <Users className="h-6 w-6 text-primary" />
                               <div>
                                  <p className="text-sm text-muted-foreground">Empleados</p>
                                  <p className="text-xl font-bold">{businessMetrics.totalEmployees}</p>
                               </div>
                            </div>
                             <div className="flex items-center space-x-3 rounded-lg border p-4">
                               <BrainCircuit className="h-6 w-6 text-primary" />
                               <div>
                                  <p className="text-sm text-muted-foreground">Msj. IA (Mes)</p>
                                  <p className="text-xl font-bold">234,567</p>
                               </div>
                            </div>
                        </SectionCard>
                        
                        <div className="grid gap-4 md:gap-8 md:grid-cols-2">
                           <SectionCard title="Consumo de IA por Modelo">
                                <div className="w-full h-48">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={aiConsumptionData} cx="50%" cy="50%" outerRadius={60} dataKey="value" nameKey="name">
                                                {aiConsumptionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend iconSize={10} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </SectionCard>
                           <SectionCard title="Distribución de Estado">
                                <div className="w-full h-48">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={salonStatusData} cx="50%" cy="50%" outerRadius={60} dataKey="value" nameKey="name">
                                                {salonStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend iconSize={10}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </SectionCard>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col gap-4 md:gap-8">
                       <SectionCard title="Ranking de Salones por Uso (Mes)">
                            <ul className="space-y-3">
                                {businessMetrics.topSalons.map(s => (
                                    <li key={s.id} className="flex items-center justify-between text-sm">
                                        <p className="font-medium">{s.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-muted-foreground">{s.appointmentsUsed}/{s.plan.split(' ')[0]}</p>
                                            <Badge variant="outline">{s.appointments} citas</Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>
                        <SectionCard title="Salones que Superaron su Plan">
                            {businessMetrics.overPlanSalons.length > 0 ? (
                            <ul className="space-y-3">
                                {businessMetrics.overPlanSalons.map(s => {
                                    const planLimit = parseInt(s.plan.split(' ')[0]);
                                    const exceeded = ((s.appointmentsUsed / planLimit - 1) * 100).toFixed(0);
                                    return (
                                        <li key={s.id} className="flex items-center justify-between text-sm">
                                            <div>
                                               <p className="font-medium">{s.name}</p>
                                               <p className="text-xs text-muted-foreground">Plan {planLimit} - Usó {s.appointmentsUsed} citas</p>
                                            </div>
                                            <Badge variant="destructive" className="flex gap-1 items-center">
                                                <ArrowUpRight className="h-3 w-3" /> {exceeded}%
                                            </Badge>
                                        </li>
                                    );
                                })}
                            </ul>
                            ) : (<p className="text-sm text-muted-foreground text-center py-4">Ningún salón ha superado su plan este mes.</p>)}
                        </SectionCard>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <SectionCard title="Ingresos Generados por Salón" description="Visualiza y administra todos los salones de la plataforma.">
                         <div className="relative ml-auto flex-1 md:grow-0 mb-4">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Buscar por nombre o empresa..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Salón</TableHead>
                                    <TableHead>Empresa</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Estado Pago</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Precio Plan</TableHead>
                                    <TableHead>Total Facturado</TableHead>
                                    <TableHead><span className="sr-only">Acciones</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSalons.map((salon) => (
                                    <TableRow key={salon.id}>
                                        <TableCell className="font-medium">{salon.name}</TableCell>
                                        <TableCell>{salon.company}</TableCell>
                                        <TableCell>{getStatusBadge(salon.status)}</TableCell>
                                        <TableCell>{getStatusBadge(salon.paymentStatus)}</TableCell>
                                        <TableCell>{salon.plan}</TableCell>
                                        <TableCell>${salon.planPrice.toFixed(2)}</TableCell>
                                        <TableCell>${salon.totalBilled.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => { setSelectedSalon(salon); setChangePlanDialogOpen(true); }}><Edit className="mr-2 h-4 w-4" />Cambiar Plan</DropdownMenuItem>
                                                    {salon.status !== 'Suspendido' && <DropdownMenuItem onClick={() => { setSelectedSalon(salon); setSuspendAlertOpen(true); }}><Pause className="mr-2 h-4 w-4" />Suspender</DropdownMenuItem>}
                                                    {salon.status === 'Suspendido' && <DropdownMenuItem onClick={() => { setSelectedSalon(salon); setReactivateAlertOpen(true); }}><Play className="mr-2 h-4 w-4" />Reactivar</DropdownMenuItem>}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-500"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </SectionCard>
                </motion.div>
            </main>

            <AlertDialog open={isSuspendAlertOpen} onOpenChange={setSuspendAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Estás seguro de suspender este salón?</AlertDialogTitle><AlertDialogDescription>Esta acción deshabilitará el acceso del salón a la plataforma, incluyendo la creación de citas y el uso del asistente IA. Esta acción se puede revertir.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleSuspend} className="bg-destructive hover:bg-destructive/90">Suspender</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={isReactivateAlertOpen} onOpenChange={setReactivateAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Estás seguro de reactivar este salón?</AlertDialogTitle><AlertDialogDescription>Esta acción restaurará el acceso completo del salón a la plataforma.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleReactivate}>Reactivar</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isChangePlanDialogOpen} onOpenChange={setChangePlanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar plan de {selectedSalon?.name}</DialogTitle>
                        <DialogDescription>Selecciona un nuevo plan de citas para este salón. El cambio se aplicará inmediatamente.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">Plan</Label>
                            <Select onValueChange={setNewPlan} defaultValue={selectedSalon?.plan.split(' ')[0]}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecciona un plan" /></SelectTrigger>
                                <SelectContent>{plans.map(p => <SelectItem key={p.value} value={p.value}>{p.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                        <Button onClick={handleChangePlan}>Guardar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SuperAdminDashboard;