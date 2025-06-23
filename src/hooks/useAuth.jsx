import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useDemo } from '@/hooks/useDemo';
import { 
    DEMO_COMPANY, 
    DEMO_SALONS, 
    DEMO_ADMIN_USER_ID, 
    DEMO_MANAGER_USER_ID, 
    DEMO_EMPLOYEE_USER_ID,
    DEMO_EMPLOYEES
} from '@/lib/demo-data';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { isDemo, setIsDemo } = useDemo();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [managedSalon, setManagedSalon] = useState(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }

    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const activeUser = session?.user;
        setUser(activeUser);

        if (activeUser) {
          await fetchUserData(activeUser);
        } else {
          setCompany(null);
          setUserRole(null);
          setManagedSalon(null);
          setDisplayName('');
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [isDemo]);

  const fetchUserData = async (userData) => {
    if (!userData) return;
    
    setCompany(null);
    setUserRole(null);
    setManagedSalon(null);
    setDisplayName('');

    const email = userData.email.toLowerCase();

    if (email === 'superadmin@fedrita.com') {
      setUserRole('super_admin');
      setDisplayName('Super Admin');
      return;
    }

    try {
      const { data: companies, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', userData.id);
      if (companyError) throw companyError;

      if (companies && companies.length > 0) {
        const userCompany = companies[0];
        setCompany(userCompany);
        setUserRole('admin');
        setDisplayName(userCompany.name);
        setManagedSalon(null);
        return;
      }

      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('name, is_manager, salon_id')
        .eq('owner_id', userData.id)
        .single();
      
      if (employeeError && employeeError.code !== 'PGRST116') {
        throw employeeError;
      }

      if (employeeData) {
        const role = employeeData.is_manager ? 'manager' : 'employee';
        setUserRole(role);
        setDisplayName(employeeData.name);

        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*, companies(*)')
          .eq('id', employeeData.salon_id)
          .single();

        if (salonError) throw salonError;

        if (salonData) {
          setManagedSalon(salonData);
          setCompany(salonData.companies);
        }
        return;
      }

    } catch (e) {
      console.error('Exception fetching user data:', e);
      setCompany(null);
      setUserRole(null);
      setManagedSalon(null);
      setDisplayName('');
    }
  };
  
  const demoLogin = async (role) => {
    setIsDemo(true);
    let demoUser = {};
    let demoManagedSalon = null;
    let demoDisplayName = '';
    let demoCompany = null;

    switch (role) {
        case 'admin':
            demoUser = { id: DEMO_ADMIN_USER_ID, email: 'admin@demo.com' };
            demoCompany = DEMO_COMPANY;
            demoDisplayName = DEMO_COMPANY.name;
            break;
        case 'manager':
            {
                const managerData = DEMO_EMPLOYEES.find(e => e.owner_id === DEMO_MANAGER_USER_ID);
                demoUser = { id: DEMO_MANAGER_USER_ID, email: 'manager@demo.com' };
                if (managerData) {
                    demoDisplayName = managerData.name;
                    const salon = DEMO_SALONS.find(s => s.id === managerData.salon_id) || null;
                    if (salon) {
                        demoManagedSalon = salon;
                        demoCompany = salon.companies;
                    }
                }
            }
            break;
        case 'employee':
            {
                const employeeData = DEMO_EMPLOYEES.find(e => e.owner_id === DEMO_EMPLOYEE_USER_ID);
                demoUser = { id: DEMO_EMPLOYEE_USER_ID, email: 'employee@demo.com' };
                if (employeeData) {
                    demoDisplayName = employeeData.name;
                    const salon = DEMO_SALONS.find(s => s.id === employeeData.salon_id) || null;
                    if (salon) {
                        demoManagedSalon = salon;
                        demoCompany = salon.companies;
                    }
                }
            }
            break;
        default:
            return;
    }
    
    setUser(demoUser);
    setCompany(demoCompany);
    setUserRole(role);
    setManagedSalon(demoManagedSalon);
    setDisplayName(demoDisplayName);
  };

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data.user) {
      setUser(data.user);
      await fetchUserData(data.user);
    }
    return { success: true, user: data.user };
  };

  const register = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data.user) {
      const tempUser = { ...data.user, needsCompanySetup: true };
      setUser(tempUser);
    }
    return { success: true, user: data.user };
  };

  const registerWithCode = async (email, password, accessCode, role) => {
    setLoading(true);
    try {
        const trimmedCode = accessCode.trim();
        if (!trimmedCode) {
            return { success: false, error: "El código de acceso no puede estar vacío." };
        }
        
        const { data: salonData, error: rpcError } = await supabase
            .rpc('find_salon_by_code', { p_code: trimmedCode })
            .single();

        if (rpcError || !salonData || !salonData.id) {
            if (rpcError && rpcError.message.includes('function public.find_salon_by_code(p_code) does not exist')) {
                 return { success: false, error: "La función de validación no está configurada. Por favor, ejecuta el script SQL en Supabase." };
            }
            return { success: false, error: "El código de acceso es inválido o no se ha encontrado." };
        }

        const now = new Date();
        const expiresAt = salonData.access_code_expires_at ? new Date(salonData.access_code_expires_at) : null;

        if (!expiresAt || expiresAt < now) {
            return { success: false, error: "El código de acceso ha expirado. Por favor, solicita uno nuevo." };
        }

        const salonInfo = {
            id: salonData.id,
            company_id: salonData.company_id,
            owner_id: salonData.owner_id
        };

        let authResponse = await supabase.auth.signUp({ email, password });

        if (authResponse.error && authResponse.error.message.includes('User already registered')) {
            authResponse = await supabase.auth.signInWithPassword({ email, password });
            if (authResponse.error) {
                 return { success: false, error: "Este email ya está registrado. La contraseña es incorrecta." };
            }
            const { data: existingEmployee } = await supabase.from('employees').select('id').eq('owner_id', authResponse.data.user.id).single();
            if(existingEmployee) {
                return { success: false, error: "Este usuario ya pertenece a un salón. Contacta con soporte si crees que es un error." };
            }
        } else if (authResponse.error) {
            return { success: false, error: authResponse.error.message };
        }
        
        const authUser = authResponse.data.user;
        if (!authUser) {
            return { success: false, error: "No se pudo autenticar al usuario." };
        }

        const employeeName = email.split('@')[0];
        const employeeData = {
            salon_id: salonInfo.id,
            company_id: salonInfo.company_id,
            name: employeeName,
            is_manager: role === 'manager',
            owner_id: authUser.id,
            services: [],
            work_hours: '',
        };

        const { error: employeeError } = await supabase.from('employees').insert([employeeData]);
        if (employeeError) {
            console.error("Error creating employee profile:", employeeError);
            return { success: false, error: `No se pudo crear el perfil de empleado: ${employeeError.message}` };
        }
        
        if (role === 'manager') {
            await supabase.from('salons').update({ manager_id: authUser.id }).eq('id', salonInfo.id);
        }

        const { data: fullSalonData, error: fullSalonError } = await supabase
            .from('salons')
            .select('*')
            .eq('id', salonInfo.id)
            .single();
        if (fullSalonError) throw fullSalonError;

        const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', salonInfo.company_id)
            .single();
        if (companyError) throw companyError;

        setUser(authUser);
        setUserRole(role);
        setManagedSalon(fullSalonData);
        setCompany(companyData);
        setDisplayName(employeeName);
        localStorage.removeItem('fedrita_user_temp');

        return { success: true, user: authUser, role };
    } catch (error) {
        console.error("Unexpected error in registerWithCode:", error);
        return { success: false, error: "Ocurrió un error inesperado." };
    } finally {
        setLoading(false);
    }
  };


  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setCompany(null);
    setUserRole(null);
    setManagedSalon(null);
    setDisplayName('');
    setIsDemo(false);
    setLoading(false);
  };
  
  const updateUserContext = async (userId) => {
    if (isDemo) {
      return;
    }
    if (!userId) return;
    const { data: { user: refreshedUser } } = await supabase.auth.getUser();
    setUser(refreshedUser);
    await fetchUserData(refreshedUser);
  };

  const value = {
    user,
    company,
    userRole,
    managedSalon,
    salonId: managedSalon?.id,
    displayName,
    login,
    demoLogin,
    register,
    logout,
    loading,
    fetchUserData,
    updateUserContext,
    registerWithCode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};