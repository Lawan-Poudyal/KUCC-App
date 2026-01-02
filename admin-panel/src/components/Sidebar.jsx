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
import { supabase } from '../services/supabaseClient';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Events', path: '/event-management' },
        { name: 'Workshops', path: '/workshops' },
        { name: 'Notifications', path: '/sendnotification' },
        { name: 'Approvals', path: '/membership' },
        { name: 'Members', path: '/members' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };


    return (
        <aside className="w-64 bg-white shadow-md p-5 hidden md:block">
            <div className="text-2xl font-bold mb-8" style={{ color: '#585F8A' }}>
                Dept Admin
            </div>

            <nav className="space-y-4">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`block cursor-pointer transition-colors ${location.pathname === item.path
                            ? 'font-semibold text-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {item.name}
                    </a>
                ))}
                <a
                    onClick={handleLogout}
                    className="block text-red-500 mt-10 cursor-pointer hover:text-red-600">
                    Logout
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;
