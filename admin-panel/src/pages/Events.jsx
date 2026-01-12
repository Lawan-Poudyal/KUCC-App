import React, { useEffect, useState } from 'react'
import { deleteEvent, getEvents } from '../services/eventService.js';
import EventCard from '../components/EventCard.jsx';

const Events = () => {
    const [events, setEvents]= useState([]);
    const [loading,setLoading]= useState(true);

    // fetch all events
    useEffect(()=>{
        const fetchEvents=async () => {
            try {
                const data=await getEvents();
                console.log(data);
                setEvents(data);
            } catch (err) {
                console.error('Error fetching events:',err.message);           
            }finally{
                setLoading(false);
            }      
        };
        fetchEvents();
    },[]);

// delete event
    const handleDelete=async (event) => {
             const confirmDelete=window.confirm(
                'Are you sure you want to delte this event?'
             );
             if(!confirmDelete) return;

             try{
                 /*
        banner_url example:
        https://xxxx.supabase.co/storage/v1/object/public/event-banners/banner.png

        storage needs:
        banner.png
      */
     let bannerPath=null;
     if(event.banner_url){
        bannerPath=event.banner_url.split('/event-banners/')[1];
     }
     await deleteEvent(event.id, bannerPath);

     // remove deleted event from UI
     setEvents(prevEvents=>
        prevEvents.filter(e=> e.id !==event.id)
     );
     alert('Event deleted successfully');
             }catch(error){
                alert('Delete failed:' + error.message);
             }
    };

// UI states
    if(loading) return <p>Loading events...</p>;
    if(!events.length) return <p>No events found.</p>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        {events.map(event=>(
            <EventCard key={event.id} event={event}
            onDelete={()=> handleDelete(event)}
            />
        ))}
    </div>
  );
}

export default Events;