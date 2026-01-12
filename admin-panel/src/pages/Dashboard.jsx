import { useNavigate } from 'react-router-dom';
import ActionCard from "../components/ActionCard";
import StatsCard from "../components/StatsCard";
import AdminLayout from "../layouts/AdminLayout";
import {  useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { getEventRegistrationsCount, getEvents } from '../services/eventService.js';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats,setStats]=useState({
        members:0,
        events:0,
        pending:0,
        activePercent:0,
    });
    const [loadingStats,setLoadingStats]=useState(true);

    // events state
    const [recentEvents,setRecentEvents]= useState([]);
    const [loadingEvents, setLoadingEvents]= useState(true);

    // fetch all stats
    useEffect(()=>{
        const fetchStats=async () => {
        try {
            // count approved members
            const {count:membersCount, error:memError}=await supabase
            .from("membership_requests")
            .select("*",{count:"exact"})
            .eq("status","approved");

            if(memError) throw memError;

            // count all events
            const {count: eventsCount, error:eventError}=await supabase
            .from("events")
            .select("*",{count:"exact"});

            if(eventError) throw eventError;

            // count pending membership requests
            const {count: pendingCount, error: pendingError}=await supabase
            .from("membership_requests")
            .select("*",{count:"exact"})
            .eq("status","pending");

            if(pendingError) throw pendingError;

            // count active events(future dates)
            const {count:activeCount, error:activeError}=await supabase
            .from("events")
            .select("*",{count:"exact"})
            .gte("event_date",new Date().toISOString());

            if(activeError) throw activeError;

            const activePercentage = eventsCount
            ? Math.round((activeCount / eventsCount) * 100)
            : 0;

            setStats({
                members: membersCount || 0,
                events: eventsCount || 0,
                pending: pendingCount || 0,
                activePercent: activePercentage,
            });
        } catch (error) {
            console.error("Failed to fetch stats:",error.message);
        }finally{
            setLoadingStats(false);  // not to show loading... after data fetches complete
        }
        };
        fetchStats();
    },[]);

    // fetch recent events
    useEffect(()=>{
        const fetchRecentEvents=async () => {
            try {
                setLoadingEvents(true);
                const events=await getEvents();
                const upcomingEvents= events.filter(
                    (e)=> new Date(e.event_date) >=new Date()
                );

                //fetch registration count for each event
                const eventsWithCount=await Promise.all(
                    upcomingEvents.map(async (e) => {
                        const count=await getEventRegistrationsCount(e.id);
                        return {...e,registrationCount: count};
                    })
                );

                // take latest events
                setRecentEvents(eventsWithCount.slice(0,3));

            } catch (error) {
                console.error("Failed to fetch recent events:",error.message);
            }finally{
                setLoadingEvents(false);
            }
        };
        fetchRecentEvents();
    },[]);
    

    return (
        <AdminLayout>
                {/* Dashboard Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold">Welcome back, Admin</h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {loadingStats ? (
                    <p className=''>Loading stats...</p>
                ):(
                    <>
                    <StatsCard 
                    title="Members"
                     value={stats.members}
                      color="bg-indigo-400" />

                    <StatsCard 
                    title="Events"
                     value={stats.events}
                      color="bg-green-400" />
                    
                    <StatsCard 
                    title="Pending"
                     value={stats.pending}
                      color="bg-orange-400" />

                    <StatsCard
                     title="Active" 
                     value={`${stats.activePercent}%`}
                      color="bg-purple-400" />
                    </>
                )
            }
            </div>

 {/* Quick Actions */}
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                <div onClick={() => navigate('/create-event')}>
                    <ActionCard title="Create Event" subtitle="Add New Event" />
                </div>

                <div onClick={()=> navigate('/membership')}>
                <ActionCard title="Approvals" subtitle="Check pending" />
                </div>

                <div onClick={()=> navigate('/sendnotification')}>
                <ActionCard title="Send Notification" subtitle="Broadcast Message" />
                </div>

                <div onClick={()=>navigate('/members')}>
                <ActionCard title="Members" subtitle="View Directory" />
                </div>
            </div>

             {/* Event Registrations Button */}
             <div className='mb-6'>
                <button 
                onClick={()=> navigate("/event-registrations")}
                className='px-4 py-2 bg-[#585F8A] text-white rounded-xl hover:opacity-90 transition'
                >
                    Event Registrations
                </button>
             </div>


   {/* Recent Events */}
            <div className="bg-white p-5 rounded-xl shadow mb-6">
                <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">Recent Events</h3>
                    <span 
                     onClick={()=> navigate('/events')}
                    className="text-indigo-600 cursor-pointer">View All →</span>
                </div>

                {loadingEvents ? (
                    <p>Loading events...</p>
                ): recentEvents.length === 0 ? (
                    <p>No upcoming events</p>
                ):(
                    <div className='space-y-3'>
                        {recentEvents.map((event)=>(
                            <div key={event.id} className='flex justify-between'>
                                <div>
                                    <p className='font-medium'>{event.title}</p>
                                    <p className='text-sm text-gray-500'>
                                        {new Date(event.event_date).toLocaleDateString()} . {event.registrationCount} registered
                                    </p>
                                </div>
                                <span className='text-green-600 font-medium'>Active</span>
                            </div>
                        ))}
                    </div>

                )
            };
            </div>

   {/* Membership Progress */}
            <div className="bg-white p-5 rounded-xl shadow">
                <div className="flex justify-between mb-3">
                    <p className="font-medium">8 membership applications waiting</p>
                    <span 
                    onClick={()=> navigate('/membership')}
                    className="text-indigo-600 cursor-pointer">Review →</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full w-2/3"></div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
