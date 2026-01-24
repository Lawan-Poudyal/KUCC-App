import React, { useEffect, useState } from 'react'
import { getAllEventApplications, updatePaymentStatus } from '../services/eventPaymentService.js';
import AdminLayout from '../layouts/AdminLayout.jsx'
import PaymentModal from '../components/PaymentModal.jsx'

const EventApplications = () => {
    const[applications, setApplications]=useState([]);
    const [loading,setLoading]=useState(true);
    const [searchQuery,setSearchQuery]=useState('');
    const [filterStatus, setFilterStatus]=useState('all');
    const [filterPayment, setFilterPayment]=useState('all');
    const [selectedApp, setSelectedApp]=useState(null);
    const [showPaymentModal,setShowPaymentModal]=useState(false);

    const fetchApplications=async () => {
        try {
            setLoading(true);
            const data=await getAllEventApplications();
            setApplications(data);
        } catch (error) {
            console.error('Failed to load applications:', error.message);
            alert('Failed to load applications');
            
        }finally{
            setLoading(false);
        }  
    };

    useEffect(()=>{
        fetchApplications();
    },[]);

    const handlePaymentUpdate=async (registrationId, paymentData) => {

        try {
            await updatePaymentStatus(registrationId,paymentData);
            setApplications(prev =>
                prev.map(app =>
                    app.id === registrationId
                    ? {...app, ...paymentData, paid_at: paymentData.payment_status === 'paid' ? new Date().toISOString(): null}
                    : app
                )
            );
            setShowPaymentModal(false);
            alert('Payment status updated successfully');
        } catch (error) {
            console.error('Failed to update payment:',error.message);
            alert('Failed to update payment status'); 
        }
    };

    // filter applications
    const filteredApplications=applications.filter(app => {
        const matchesSearch=app.event_title?.toLowerCase().includes(searchQuery.toLowerCase());
        console.log('checking if users search text exists inside the event title',matchesSearch);

        const matchesStatus=filterStatus === 'all' || app.status === filterStatus;
        console.log('Checks if the record matches a selected status dropdown',matchesStatus);

        const matchesPayment=filterPayment === "all" || app.payment_status === filterPayment;
        console.log('checking for the payment status:',matchesPayment);

        return matchesSearch && matchesStatus && matchesPayment;
    });

    if(loading){
        return(
            <AdminLayout>
                <div className="text-center py-10">Loading applications...</div>
            </AdminLayout>
        );
    }
  return (
   <AdminLayout>
    <div className='max-w-7xl mx-auto'>

        {/*Header */}
        <div className='mb-6'>
            <h2 className='text-2xl font-bold text-[#585F8A]'>Event Applications & Payments</h2>
            <p className='text-gray-600 mt-1'>Manage event registrations and payment statuses</p>
        </div>

        {/*Filters */}
        <div className='bg-white rounded-xl shadow p-4 mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

                {/*Search */}
                <input
                type="text"
                placeholder='Search by event name...'
                value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
                className='px-4 py-2 border rounded-lg'
                />

                {/* Registration Status Filter */}
                <select
                value={filterStatus}
                onChange={(e)=> setFilterStatus(e.target.value)}
                className='px-4 py-2 border rounded-lg'
                >
                    <option value='all'>All Registration Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                {/* Payment Status Filter */}
                <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
                    </div>
                </div>

                {/* Applications Table */}
                 {filteredApplications.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {app.event_title || 'Unknown Event'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {app.event_date && new Date(app.event_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.applied_at).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(app.applied_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.event_is_paid
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {app.event_is_paid ? 'Paid Event' : 'Free Event'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : app.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.payment_status === 'refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {app.payment_status || 'unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.payment_method || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.payment_amount 
                          ? `NPR ${parseFloat(app.payment_amount).toFixed(2)}`
                          : app.events?.is_paid
                          ? `NPR ${parseFloat(app.events.payment_amount || 0).toFixed(2)}`
                          : 'Free'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowPaymentModal(true);
                          }}
                          className="text-[#585F8A] hover:text-[#484f75] font-medium"
                        >
                          Update Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedApp && (
          <PaymentModal
            application={selectedApp}
            onClose={() => setShowPaymentModal(false)}
            onUpdate={handlePaymentUpdate}
          />
        )}
    </div>
   </AdminLayout>
  )
}

export default EventApplications;