import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

const EventManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // TODO: Replace with actual data from Supabase
    const events = [
        {
            id: 1,
            name: 'Git & GitHub Workshop',
            date: 'December 25, 2025 2:00 pm',
            registered: '45/50',
            status: 'active',
            tab: 'upcoming'
        },
        {
            id: 2,
            name: 'React Native Bootcamp',
            date: 'December 25, 2025 2:00 pm',
            registered: '45/50',
            status: 'active',
            tab: 'upcoming'
        },
        {
            id: 3,
            name: 'HackerFest 2024',
            date: 'December 25, 2025 2:00 pm',
            registered: '45/50',
            status: 'completed',
            tab: 'past'
        },
        {
            id: 4,
            name: 'AI/ML Camp',
            date: 'December 25, 2025 2:00 pm',
            registered: '45/50',
            status: 'completed',
            tab: 'past'
        },
        {
            id: 5,
            name: 'Web Development Workshop',
            date: 'January 15, 2026 3:00 pm',
            registered: '0/30',
            status: 'draft',
            tab: 'draft'
        }
    ];

    // Filter events based on active tab and search
    const filteredEvents = events.filter(event => {
        const matchesTab = activeTab === 'all' || event.tab === activeTab;
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'past', label: 'Past' },
        { id: 'draft', label: 'Draft' }
    ];

    const handleDelete = (eventId) => {
        // TODO: Add confirmation dialog and Supabase delete logic
        if (window.confirm('Are you sure you want to delete this event?')) {
            console.log('Deleting event:', eventId);
            // Delete from Supabase here
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold" style={{ color: '#585F8A' }}>
                        Event Management
                    </h2>
                    <button
                        onClick={() => navigate('/create-event')}
                        className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
                        style={{ backgroundColor: '#585F8A' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 relative">
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Events"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all"
                            style={{ focusRingColor: '#585F8A' }}
                            onFocus={(e) => e.target.style.borderColor = '#585F8A'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>
                    <button
                        className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        style={{ color: '#585F8A' }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            style={activeTab === tab.id ? { backgroundColor: '#585F8A' } : {}}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div
                                key={event.id}
                                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {event.name}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : event.status === 'completed'
                                                            ? 'bg-gray-200 text-gray-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {event.status === 'active' ? 'Active' : event.status === 'completed' ? 'Completed' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                                        <p className="text-sm text-gray-500">{event.registered} registered</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/events/${event.id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 rounded-lg font-medium transition-all hover:bg-gray-50"
                                        style={{ borderColor: '#585F8A', color: '#585F8A' }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/events/${event.id}/edit`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-700 transition-all hover:bg-gray-50"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="px-4 py-2.5 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div
                                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: '#585F8A20' }}
                            >
                                <svg
                                    className="w-8 h-8"
                                    style={{ color: '#585F8A' }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No events found</h3>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default EventManagement;