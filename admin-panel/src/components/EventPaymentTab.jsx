import React, { useEffect, useState } from 'react';
import { getEventApplications, updatePaymentStatus, getEventPaymentStats } from '../services/eventPaymentService.js';
import PaymentModal from '../components/PaymentModal.jsx';

const EventPaymentTab = ({ eventId }) => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);


  const fetchApplicationsAndStats = async () => {
    try {
      setLoading(true);
      const [appsData, statsData] = await Promise.all([
        getEventApplications(eventId),
        getEventPaymentStats(eventId)
      ]);
      setApplications(appsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load payment data:', error.message);
      alert('Failed to load payment information');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (eventId) {
      fetchApplicationsAndStats();
    }
  }, [eventId]);

  const handlePaymentUpdate = async (registrationId, paymentData) => {
    try {
      await updatePaymentStatus(registrationId, paymentData);
      await fetchApplicationsAndStats(); // Refresh data
      setShowPaymentModal(false);
      alert('Payment status updated successfully');
    } catch (error) {
      console.error('Failed to update payment:', error.message);
      alert('Failed to update payment status');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading payment data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              NPR {stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No applications found for this event
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Applied At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {app.user_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        app.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        app.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : app.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {app.payment_status || 'unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.payment_method || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {app.payment_amount 
                        ? `NPR ${parseFloat(app.payment_amount).toFixed(2)}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowPaymentModal(true);
                        }}
                        className="text-[#585F8A] hover:text-[#484f75] text-sm font-medium"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedApp && (
        <PaymentModal
          application={selectedApp}
          onClose={() => setShowPaymentModal(false)}
          onUpdate={handlePaymentUpdate}
        />
      )}
    </div>
  );
};

export default EventPaymentTab;