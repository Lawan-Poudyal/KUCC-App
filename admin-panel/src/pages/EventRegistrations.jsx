import React, { useEffect, useState } from 'react'
import {getAllEventRegistrations,updateRegistrationStatus} from '../services/eventService.js'

const EventRegistrations = () => {
    const [registrations,setRegistrations]= useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        fetchRegistrations();
    },[]);

    const fetchRegistrations=async () => {
        try {
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
        } catch (error) {
            alert("Failed to update status");
            console.error(error.message);
        }
    };

    if(loading) return <p>Loading registrations...</p>;
    if(!registrations.length) return <p>No registrations found.</p>;

  return (
    <div className='p-6'>
        <h2 className='text-2xl font-bold mb-6'>EventRegistrations</h2>

        <div className='space-y-4'>
            {registrations.map((reg)=>(
                
                <div key={reg.id}
                className='bg-white p-4 rounded-xl shadow border'>
                    <p className='font-semibold'>Event:{reg.events.title}</p>
                    <p>User ID: {reg.user_id}</p>

                    <p>
                        Status:{""}
                        <span className='font-medium capitalize'>{reg.status}</span>
                    </p>

                    <div className='flex gap-3 mt-3'>

                        <button
                        onClick={()=> handleStatusChange(reg.id,"approved")}
                        className='px-4 py-2 bg-green-600 text-white rounded-lg'
                        disabled={reg.status === "approved"}>
                            Approve
                        </button>

                        <button
                        onClick={()=>
                            handleStatusChange(reg.id,"rejected")
                        }
                        className='px-4 py-2 bg-red-600 text-white rounded-lg'
                        disabled={reg.status === "rejected"}
                        >
                            Reject
                            </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default EventRegistrations;