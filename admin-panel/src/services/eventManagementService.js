import { supabase } from "./supabaseClient";

export const getEventsWithRegistrations=async () => {
 
   // fetch events
   const {data:events, error}=await supabase
   .from("events")
   .select(`
      id,
      title,
      event_date,
      event_time,
      max_participants,
      status,
      created_at
    `)
    .order("event_date", {ascending: true});

    if(error) throw error;

    // Process events and count registrations
    const updatedEvents= await Promise.all(
      events.map(async (event) => {
        let currentStatus=event.status;

        // auto-complete past events
       const eventDateTime= new Date(`${event.event_date}T${event.event_time}`);
       const now=new Date();

       if(event.status === "active" && eventDateTime < now){
        await supabase
        .from("events")
        .update({status:"completed"})
        .eq("id", event.id);

        event.status= "completed";
       }

        // get registration count for this event
        const {count, error:countError}= await supabase
        .from("event_registrations")
        .select("*", {count:"exact" ,head:true})
        .eq("event_id",event.id);

        if(countError) throw countError;

        //return the combined object
        return{
          ...event,
          status: currentStatus,
          registered: `${count || 0}/${event.max_participants || 0}`,
          registeredCount: count || 0
        };      
      })
    );
    return updatedEvents;
};

