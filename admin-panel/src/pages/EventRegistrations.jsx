import React, { useEffect, useState } from 'react'
import {getAllEventRegistrations,updateRegistrationStatus} from '../services/eventService.js'

const EventRegistrations = () => {
    const [registrations,setRegistrations]= useState([]);
    const [loading,setLoading]=useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        fetchRegistrations();
    },[]);

    const fetchRegistrations=async () => {
        try {
            setLoading(true);
            setError(null);
            const data= await getAllEventRegistrations();
            setRegistrations(data);
        } catch (error) {
            alert("Failed to load registrations");
            console.error(error.message);
            
        }finally{
            setLoading(false);
        }
    };

    const handleStatusChange=async(id,status)=>{
        try {
            await updateRegistrationStatus(id,status);
            setRegistrations((prev)=> 
            prev.map((r)=>
            r.id === id ? {...r,status} : r
            )
            );
            alert(`Registration ${status} successfully`);

        } catch (error) {
            alert("Failed to update status");
            console.error('Error updating status:',error.message);
        }
    };

    if(loading) return <p>Loading registrations...</p>;

    if (error) {
        return (
            <div className='p-6 text-center'>
                <p className='text-red-600'>{error}</p>
                <button 
                    onClick={fetchRegistrations}
                    className='mt-4 px-4 py-2 bg-[#585F8A] text-white rounded-lg'
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!registrations.length) {
        return (
            <div className='p-6 text-center'>
                <p className='text-gray-600'>No registrations found.</p>
            </div>
        );
    }
return (
        <div className='p-6'>
            <h2 className='text-2xl font-bold mb-6 text-[#585F8A]'>Event Registrations</h2>

            <div className='space-y-4'>
                {registrations.map((reg) => (
                    <div 
                        key={reg.id}
                        className='bg-white p-4 rounded-xl shadow border hover:shadow-md transition-shadow'
                    >
                        {/* FIXED: Use flattened event_title instead of nested events.title */}
                        <p className='font-semibold text-lg text-gray-900'>
                            Event: {reg.event_title || 'Unknown Event'}
                        </p>
                        
                        <div className='mt-2 space-y-1 text-sm text-gray-600'>
                            <p>
                                <span className='font-medium'>User ID:</span> {reg.user_id}
                            </p>
                            <p>
                                <span className='font-medium'>Applied:</span>{' '}
                                {new Date(reg.applied_at).toLocaleString()}
                            </p>
                            {/* FIXED: Use flattened event_date */}
                            {reg.event_date && (
                                <p>
                                    <span className='font-medium'>Event Date:</span>{' '}
                                    {new Date(reg.event_date).toLocaleDateString()}
                                </p>
                            )}
                            <p>
                                <span className='font-medium'>Status:</span>{' '}
                                <span className={`font-semibold capitalize ${
                                    reg.status === 'approved' ? 'text-green-600' :
                                    reg.status === 'rejected' ? 'text-red-600' :
                                    'text-yellow-600'
                                }`}>
                                    {reg.status}
                                </span>
                            </p>
                            {reg.payment_status && (
                                <p>
                                    <span className='font-medium'>Payment:</span>{' '}
                                    <span className={`font-semibold capitalize ${
                                        reg.payment_status === 'paid' ? 'text-green-600' :
                                        reg.payment_status === 'pending' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                        {reg.payment_status}
                                    </span>
                                </p>
                            )}
                        </div>

                        <div className='flex gap-3 mt-4'>
                            <button
                                onClick={() => handleStatusChange(reg.id, "approved")}
                                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={reg.status === "approved"}
                            >
                                {reg.status === "approved" ? "Approved" : "Approve"}
                            </button>

                            <button
                                onClick={() => handleStatusChange(reg.id, "rejected")}
                                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={reg.status === "rejected"}
                            >
                                {reg.status === "rejected" ? "Rejected" : "Reject"}
                            </button>

                            {reg.status === "approved" || reg.status === "rejected" ? (
                                <button
                                    onClick={() => handleStatusChange(reg.id, "pending")}
                                    className='px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700'
                                >
                                    Reset to Pending
                                </button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  
};

export default EventRegistrations;