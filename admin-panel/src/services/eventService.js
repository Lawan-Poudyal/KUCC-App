import { supabase } from "./supabaseClient";

export const getEvents=async () => {
    const {data,error}=await supabase
    .from('events')
    .select('*')
    .order('event_date', {ascending: true});

    if(error) throw error;
    return data;
    
};

export const deleteEvent=async (id,bannerPath) => {
    // Delete DB row
    const {error: dbError}=await supabase
    .from('events')
    .delete()
    .eq('id',id);

    if(dbError) throw dbError;

    // delete banner from storage
    if(bannerPath){
        const {error: storageError}=await supabase
        .storage
        .from('event-banners')
        .remove([bannerPath]);

        if(storageError) throw storageError;
    }
};

export const updateEvent= async(id,payload)=>{
    const {data,error}= await supabase
    .from('events')
    .update(payload)
    .eq('id',id);

    if(error) throw error;
    return data;
};

// count registrations for event (Dashboard)
export const getEventRegistrationsCount=async (eventId) => {
    if(!eventId) return 0;

    const {count,error}=await supabase
    .from('event_registrations')
    .select("*",{count:"exact", head: true}
    )
    .eq("event_id",eventId);

    if(error) throw error;
    return count || 0;
};

// get all registrations (Admin page)

 export const getAllEventRegistrations=async () => {
    const {data,error}= await supabase
    .from('event_applications_view')
    .select('*')
     .order('applied_at', { ascending: false });

     if (error) {
        console.error('Error fetching registrations:', error);
        throw error;
    }
    
    return data || [];
}


// approve/reject registrations
export const updateRegistrationStatus=async (id,status) => {
    const {error}=await supabase
    .from("event_registrations")
    .update({status})
    .eq("id",id);

    if(error) throw error;
    
};

// publish the event

export const publishEvent=async (eventId) => {
  const {error}=await supabase
  .from("events")
  .update({status:"active"})
  .eq("id",eventId);

  if(error) throw error;
  
};

// unpublish the event
export const unpublishEvent=async (eventId) => {
    const {error}=await supabase
    .from("events")
    .update({status:"draft"})
    .eq("id",eventId);

    if(error) throw error;
    
};

// for EventDetails.jsx file
export const getEventById= async (eventId) => {
    const {data,error}=await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      event_date,
      event_time,
      max_participants,
      status,
      is_paid,
      payment_amount,
      payment_methods,
      created_at
    `)
    .eq("id",eventId)
    .single();

    if(error) throw error;

    // get registration count
    const {count, error: countError}=await supabase
    .from("event_registrations")
    .select("*", {count:"exact" , head:true})
    .eq("event_id",eventId);

    if(countError) throw countError;

    return {
        ...data,
        registered: count || 0,
    };
    
};