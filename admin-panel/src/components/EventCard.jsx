import React from "react";
import { useNavigate } from "react-router-dom";


export default function EventCard({event,onDelete}){
    const navigate=useNavigate();

    // navigate to edit event page
    const handleEdit= () => {
        navigate(`/edit-event/${event.id}`);  
    };

    // call parent's delete handler
    const handleDelete=()=>{
        if(onDelete){
            onDelete(event);
        }
    };
  


    return(
       <div className="bg-white border-2 shadow rounded-xl overflow-hidden flex flex-col md:flex-row gap-4 p-4">
        {event.banner_url && (
            <img
            src={event.banner_url}
            alt={event.title}
            className="h-40 w-full md:w-64 object-cover rounded-lg"
            />
        )}
        <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <p className="text-gray-500 mt-1">
                Date: {event.event_date} | Time:{event.event_time}
            </p>
            <p className="text-gray-500 mt-1">Location:{event.location}</p>
            <p className="text-gray-500 mt-1">Type:{event.event_type}</p>

            <div className="flex gap-2 mt-4">
                <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                    Edit
                </button>

                <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                    Delete
                </button>

            </div>

        </div>
       </div>
    );
}
