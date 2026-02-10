// const Sidebar = () => {
//     return (
//         <aside className="w-64 bg-white shadow-md p-5 hidden md:block">
//             {/* LOGO */}
//             {/* COMMENT: Place department/club logo image here */}
//             <div className="text-2xl font-bold text-indigo-600 mb-8">
//                 Dept Admin
//             </div>

//             <nav className="space-y-4">
//                 <a className="block font-medium text-gray-700">Dashboard</a>
//                 <a className="block text-gray-600">Events</a>
//                 <a className="block text-gray-600">Workshops</a>
//                 <a className="block text-gray-600">Notifications</a>
//                 <a className="block text-gray-600">Approvals</a>
//                 <a className="block text-gray-600">Members</a>
//                 <a className="block text-red-500 mt-10">Logout</a>
//             </nav>
//         </aside>
//     );
// };

// export default Sidebar;

import { useLocation, useNavigate } from 'react-router-dom';
import clubLogo from '../assets/kucc.png';
import { supabase } from '../services/supabaseClient';
import { useEffect, useState } from 'react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
 
    const [role, setRole] = useState(null); // editor | master
  const [loading, setLoading] = useState(true);

  // fetch current admin role from supabase
  useEffect(()=>{
    const fetchRole=async () => {
        const {data: sessionData}= await supabase.auth.getSession();
        const session=sessionData?.session;

        if(!session){
            setRole(null);
            setLoading(false);
            return;
        }

        const {data:admin, error}=await supabase
        .from('admins')
        .select('role, is_active')
        .eq('id', session.user.id)
        .single();

        if(!error && admin?.is_active){
            setRole(admin.role);
        }else{
            setRole(null);
        }
        setLoading(false);
    };
    fetchRole();
  },[]);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Events', path: '/event-management' },
        { name: 'Event Applications', path: '/event-applications' },
        { name: 'Certificates', path: '/certificate-generator' },
        { name: 'Notifications', path: '/sendnotification' },
        { name: 'Approvals', path: '/membership'},
        { name: 'Members', path: '/members' },
        {name:"Manage Admins", path:'/admin-management',role:'master' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if(loading) return null; 


    return (
        <aside className="w-64 bg-white shadow-md p-5 hidden md:block">
             <div
                className="mb-8 cursor-pointer"
                onClick={() => navigate('/dashboard')}
            >
                <img src={clubLogo} alt="Club Logo"  className='w-32 h-auto'/>
            </div>



      {/* Navigation */}
              <nav className="space-y-3">
                {navItems.map((item) => {

                    // Hide items that are role-specific and don't match current role
                    if (item.role && item.role !== role) return null;

                    const isActive = location.pathname === item.path;

                    return (
                        <div
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`px-3 py-2 rounded-lg cursor-pointer transition
                                ${isActive
                                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {item.name}
                        </div>
                    );
                })}

                 {/* Logout */}
        <div
          onClick={handleLogout}
          className="mt-10 px-3 py-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-lg transition"
        >
          Logout
        </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
