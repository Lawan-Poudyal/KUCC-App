import { useNavigate } from 'react-router-dom';
import ActionCard from "../components/ActionCard";
import StatsCard from "../components/StatsCard";
import AdminLayout from "../layouts/AdminLayout";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <AdminLayout>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Welcome back, Admin</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatsCard title="Members" value="250" color="bg-indigo-400" />
                <StatsCard title="Events" value="20" color="bg-green-400" />
                <StatsCard title="Pending" value="10" color="bg-orange-400" />
                <StatsCard title="Active" value="85%" color="bg-purple-400" />
            </div>

            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div onClick={() => navigate('/create-event')}>
                    <ActionCard title="Create Event" subtitle="Add New Event" />
                </div>
                <ActionCard title="Approvals" subtitle="6 pending" />
                <ActionCard title="Send Notification" subtitle="Broadcast Message" />
                <ActionCard title="Members" subtitle="View Directory" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow mb-6">
                <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">Recent Events</h3>
                    <span className="text-indigo-600 cursor-pointer">View All →</span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <div>
                            <p className="font-medium">Git Workshop</p>
                            <p className="text-sm text-gray-500">Dec 25, 2025 · 45 registered</p>
                        </div>
                        <span className="text-green-600 font-medium">Active</span>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <p className="font-medium">React Bootcamp</p>
                            <p className="text-sm text-gray-500">Dec 25, 2025 · 45 registered</p>
                        </div>
                        <span className="text-green-600 font-medium">Active</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
                <div className="flex justify-between mb-3">
                    <p className="font-medium">8 membership applications waiting</p>
                    <span className="text-indigo-600 cursor-pointer">Review →</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full w-2/3"></div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
