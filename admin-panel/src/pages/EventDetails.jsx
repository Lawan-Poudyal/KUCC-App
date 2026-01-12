import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEventById } from '../services/eventService.js';
import AdminLayout from '../layouts/AdminLayout';

const EventDetails = () => {
    const navigate=useNavigate();
    const {eventId}= useParams();

    const [event,setEvent]= useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchEvent=async()=>{
            try {
               setLoading(true);
               const data=await getEventById(eventId);
               setEvent(data); 
            } catch (error) {
                console.error("Failed to load event details:",error.message);
                
            }finally{
                setLoading(false);
            }
        };
        fetchEvent();
    },[eventId]);

    if(loading){
        return(
            <AdminLayout>
                <p className='text-center py-10 text-gray-500'>
                    Loading event details...
                </p>
            </AdminLayout>
        );
    }
    if(!event){
        return(
            <AdminLayout>
                <p className="text-center py-10 text-red-500">
                    Event not found
                </p>
            </AdminLayout>
        );
    }
  return (
    <AdminLayout>
        <div className='max-w-4xl mx-auto bg-white rounded-xl shadow p-6'>

  {/* Header */}
  <div className='flex items-center justify-between mb-6'>
    <h2 className='text-2xl font-bold text-[#585F8A]'>
Event Details
    </h2>

    <button
    onClick={()=> navigate(-1)}
    className='border px-4 py-2 rounded-lg'
    >
         ← Back
    </button>
  </div>

  
        {/* Title & Status */}
        <div className='mb-4'>
            <h3 className='text-xl font-semibold text-gray-800'>{event.title}</h3>

            <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
              event.status === "completed"
                ? "bg-gray-200 text-gray-700"
                : "bg-green-100 text-green-700"
            }`}
            >
                {event.status.toUpperCase()}
            </span>
        </div>

        {/*Info */}
        <div className='grid grid-cols-2 gap-4 mb-6 text-sm'>
            <p>
                <strong>Date:</strong>{""}
                {new Date(event.event_date).toLocaleDateString()}
            </p>

            <p>
                <strong>Time:</strong>{event.event_time}
            </p>

            <p>
                <strong>Participants:</strong>{''}
                {event.registered}/{event.max_participants}
            </p>

            <p>
                <strong>Created At:</strong>{""}
                {new Date(event.cretaed_at).toLocaleDateString()}
            </p>
        </div>

         {/* Description */}
         <div>
            <h4 className='font-semibold mb-2'>Description</h4>
            <p className='text-gray-700 whitespace-pre-line'>
                {event.description || 'No description provided.'}
            </p>
         </div>

          {/* Completed Notice */}
          {event.status === "completed" && (
            <div className='mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600'>
                This event has been completed and is read-only.
            </div>
          )}
        </div>
    </AdminLayout>
  );
};

export default EventDetails;