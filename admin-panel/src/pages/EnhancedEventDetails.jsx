import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById } from '../services/eventService.js';
import AdminLayout from '../layouts/AdminLayout.jsx';
import EventPaymentTab from '../components/EventPaymentTab.jsx';

const EnhancedEventDetails = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (error) {
        console.error('Failed to load event details:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center py-10 text-gray-500">Loading event details...</p>
      </AdminLayout>
    );
  }

  if (!event) {
    return (
      <AdminLayout>
        <p className="text-center py-10 text-red-500">Event not found</p>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'details', label: 'Event Details' },
    { id: 'payments', label: 'Applications & Payments' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#585F8A]">Event Management</h2>
          <button
            onClick={() => navigate(-1)}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#585F8A] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <div className="bg-white rounded-xl shadow p-6">
            {/* Title & Status */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
              <div className="flex gap-2 mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'completed'
                      ? 'bg-gray-200 text-gray-700'
                      : event.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {event.status.toUpperCase()}
                </span>
                {event.is_paid && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    PAID EVENT
                  </span>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-medium">
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="font-medium">{event.event_time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Participants</p>
                <p className="font-medium">
                  {event.registered}/{event.max_participants}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created At</p>
                <p className="font-medium">
                  {new Date(event.created_at).toLocaleDateString()}
                </p>
              </div>
              {event.is_paid && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Amount</p>
                    <p className="font-medium text-green-600">
                      NPR {parseFloat(event.payment_amount || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Methods</p>
                    <p className="font-medium">
                      {event.payment_methods?.join(', ') || 'Not specified'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-2 text-gray-900">Description</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {event.description || 'No description provided.'}
              </p>
            </div>

            {/* Completed Notice */}
            {event.status === 'completed' && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
                This event has been completed and is read-only.
              </div>
            )}
          </div>
        ) : (
          <EventPaymentTab eventId={eventId} />
        )}
      </div>
    </AdminLayout>
  );
};

export default EnhancedEventDetails;