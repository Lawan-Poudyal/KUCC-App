import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { getEventsWithRegistrations } from '../services/eventManagementService.js';
import { deleteEvent,publishEvent, unpublishEvent } from '../services/eventService.js';

const EventManagement = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [events,setEvents]=useState([]);
    const [loading,setLoading]=useState(true);

// fetch events from supabase
useEffect(()=>{
    const fetchEvents=async () => {
        try {
            setLoading(true);
            const data=await getEventsWithRegistrations();
            setEvents(data);
        } catch (error) {
            console.error("Failed to load events:",error.message);
            
        }finally{
            setLoading(false);
        }
    };
    fetchEvents();
},[]);
   
// publish(Draft-> Active)
const handlePublish=async(eventId) => {
const confirmPublish= window.confirm("Publish this event?");
if(!confirmPublish) return;
    
try {
    await publishEvent(eventId);
    setEvents((prev)=>
    prev.map((e)=>
    e.id === eventId ? {...e, status: "active"} : e)
    );
    alert("Event published successfully");
} catch (error) {
    alert("Failed to publish event",error.message);
}
};

    // Filter events based on active tab and search
    const filteredEvents = events.filter((event) => {
        const matchesTab = 
        activeTab === "all" ||
        (activeTab === "draft" && event.status === "draft") ||
        (activeTab === "upcoming" && event.status === "active") ||
        (activeTab === "past" && event.status === "completed");

        const matchesSearch = event.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'past', label: 'Past' },
        { id: 'draft', label: 'Draft' }
    ];

    // delete event
    const handleDelete=async (event) => {
        const confirmDelete= window.confirm(
            'Are you sure you want to delete this event?'
        );
        if(!confirmDelete) return;

        try {
            let bannerPath= null;
            if(event.banner_url){
                bannerPath=event.banner_url.split('/event-banners/')[1];
            }
            await deleteEvent(event.id, bannerPath);
            setEvents((prev)=> prev.filter((e)=> e.id !== event.id));
            alert('Event deleted successfully');
        } catch (error) {
            alert('Delete failed:' +error.message);
        }
    };

    const handleUnpublish=async (eventId) => {
        const confirmUnpublish=window.confirm(
            "Unpublish this event ? It will no longer be visible to users."
        );
        if(!confirmUnpublish) return;

        try {
            await unpublishEvent(eventId);
            setEvents(prev =>
                prev.map(e=>
                    e.id === eventId ? {...e, status:"draft"} : e
                )
            );
            alert("Event unpublished successfully");
        } catch (error) {
            alert("Failed to unpublish event",error.message);
            
        }
        
    };

    return (
        <AdminLayout>
            <div className='max-w-5xl mx-auto'>

                {/* Header */}
                <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-2xl font-bold text-[#585F8A]'>Event Management</h2>

                    <button
                    onClick={()=> navigate("/create-event")}
                    className='px-4 py-2 rounded-lg text-white font-medium bg-[#585F8A] hover:opacity-90'
                    >+ Create Event
                    </button>
                </div>

                {/*Search */}
                <input
                type="text"
                placeholder='Search Events'
                value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
                className='w-full mb-6 px-4 py-3 border rounded-xl'
                />

                {/*Tabs */}
                <div className='flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm'>
                    {tabs.map((tab)=>(
                        <button
                        key={tab.id}
                        onClick={()=> setActiveTab(tab.id)}
                        className={`flex-1 py-3 rounded-lg font-medium
                            ${
                                activeTab === tab.id
                                ?  "bg-[#585F8A] text-white"
                                : "text-gray-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/*Event List */}
                {loading ?
            (
                <p className='text-center py-10'>Loading events...</p>
            ) : filteredEvents.length === 0 ? (
                <p className='text-center py-10'>No events found</p>
            ) : (
                <div className='space-y-4'>
                   {filteredEvents.map((event)=>(
                    <div
                    key={event.id}
                    className='bg-white rounded-xl shadow p-5'
                    >
                        <div className='mb-3'>
                            <h3 className='text-lg font-semibold'>
                                {event.title}
                            </h3>

                            <p className='text-sm text-gray-500'>
                                {new Date(event.event_date).toLocaleDateString()} .{""}
                                {event.event_time}
                            </p>

                            <p className='text-sm text-gray-500'>
                                {event.registered}
                            </p>

                            <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold 
                                ${
                                    event.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : event.status === "completed"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }
                                `}
                            >
                                {event.status}
                            </span>
                        </div>

                        {/*Action Buttons */}
                        <div className='flex gap-3'>
                              {/* VIEW (Active & Completed) */}
                            {event.status !== "draft" && (
                                <button
                                onClick={()=> navigate(`/event-management/${event.id}`)}
                                className='flex-1 border px-4 py-2 rounded-lg'
                                >
                                    View
                                </button>
                            )}

                             {/* EDIT (Draft & Active only) */}
                            {(event.status=== "draft" || event.status=== "active") && (
                                <button
                                onClick={()=> navigate(`/edit-event/${event.id}`)}
                                className='flex-1 border px-4 py-2 rounded-lg'
                                >
                                    Edit
                                </button>
                            )}
                              {/* PUBLISH */}
                            {event.status === "draft" && (
                                <button
                                onClick={()=> handlePublish(event.id)}
                                className='flex-1 bg-green-600 text-white rounded-lg'
                                >
                                    Publish
                                </button>
                            )}

                        {/* UNPUBLISH */}
                        {event.status === "active" && (
                            <button
                            onClick={()=>handleUnpublish(event.id)}
                            className="flex-1 bg-yellow-500 text-white rounded-lg"
                            >
                                Unpublish
                            </button>
                        )}

                       {/* DELETE (All states) */}
                            <button
                            onClick={()=> handleDelete(event)}
                            className='px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg'
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                   ))}
                </div>
            )
            }
            </div>
        </AdminLayout>
    );
};

export default EventManagement;