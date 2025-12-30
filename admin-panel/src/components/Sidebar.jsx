import { useLocation, useNavigate } from 'react-router-dom';
import clubLogo from '../assets/kucc.png';
import { supabase } from '../services/supabaseClient';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Events', path: '/events' },
        { name: 'Workshops', path: '/workshops' },
        { name: 'Notifications', path: '/notifications' },
        { name: 'Approvals', path: '/approvals' },
        { name: 'Members', path: '/members' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };


    return (
        <aside className="w-64 bg-white shadow-md p-5 hidden md:block">
            <div
                className="mb-8 cursor-pointer"
                onClick={() => navigate('/dashboard')}
            >
                <img src={clubLogo} alt="Club Logo" className="w-32 h-auto" />
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
