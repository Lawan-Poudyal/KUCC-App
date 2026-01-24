import { supabase } from "./supabaseClient";

const API_BASE_URL= 'http://localhost:5000/api';

// get auth token from Supabase session
const getAuthToken=async () => {
    const {data: {session}}=await supabase.auth.getSession();
    return session?.access_token || null;
    
};

// issue certificates (Admin Only)
export const issueCertificates=async (certificateData) => {
    try {
        const token=await getAuthToken();

        if(!token){
            throw new Error('Not authenticated.Please login.');
        }

        const response=await fetch(`${API_BASE_URL}/certificates/issue`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            credentials:'include',
            body:JSON.stringify(certificateData)
        });

        if(!response.ok){
            const error=await response.json();
            throw new Error(error.error || 'Failed to issue certificate');
        }
        return await response.json();
    } catch (error) {
        console.error('Error issuing certificate:',error);
        throw error;
        
    }   
};

// get all certificates (Admin only)
export const getAllCertificates=async () => {
    try {
        const token=await getAuthToken();

        if(!token){
            throw new Error('Not authenticated.Please login.');
        }

        const response =await fetch(`${API_BASE_URL}/certificates/admin`, {
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        }           
            );

            if(!response.ok){
                const error=await response.json();
                throw new Error(error.error || 'Failed to fetch cerificates');
            }
            return await response.json();
    } catch (error) {
        console.error('Error fetching certificates:',error);
        throw error;
    }  
};

// Get my certificates (User)
export const getMyCertificates=async () => {
    try{
        const token=await getAuthToken();

        if(!token){
            throw new Error('Not authenticated.Please login.');
        }
        const response= await fetch(`${API_BASE_URL}/certificates/my`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            },
            credentials:'include'
        });

        if(!response.ok){
            const error=await response.json();
            throw new Error(error.error || 'Failed to fetch your certificates');
        }

        return await response.json();
    }catch(error){
        console.error('Error fetching my certificates:', error);
        throw error;
    }
    
};

// get certificate types
export const getCertificateTypes=async () => {
    try {
        const response= await fetch(`${API_BASE_URL}/certificates/types`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            }
        });

        if(!response.ok){
             const error = await response.json();
             throw new Error(error.error || 'Failed to fetch certificate types');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching certificate types:', error);
        throw error;
    }   
};

// get events -using supabase directly
export const getEvents=async () => {
    try {
        const {data:events, error}=await supabase
        .from('events')
        .select(`
        id,
        title,
        event_date,
        event_time,
        max_participants,
        status,
        created_at,
        is_paid,
        payment_amount
      `)
      .order('event_date', { ascending: false });

      if(error) throw error;

      // get registration count for each event
      const eventsWithCount=await Promise.all(
        events.map(async (event) => {
            const {count, error:countError}=await supabase
            .from('event_registrations')
            .select('*', {count:'exact',head: true})
            .eq('event_id',event.id);

            if(countError){
                console.error('Error counting registrations:', countError);
                return {...event, registrations_count: 0};
            }

            return{
                ...event,
                registrations_count: count || 0,
                name:event.title,
                date:event.event_date,
                participants: count || 0
            };
        })
      );

      return eventsWithCount;

    } catch (error) {
        console.error('Error fetching events:',error);
        throw error;
    }
};

// Get event registrations (recipients for an event) - Using Supabase directly
export const getEventRegistrations=async (eventId) => {
    try {
        // get approved registrations with user details
        const {data,error}=await supabase
        .from('event_applications_view')
        .select(`
        id,
        event_id,
        user_id,
        registration_status,
        payment_status,
        applied_at,
         user_email,
        event_title
      `)
      .eq('event_id',eventId)
      .eq('registration_status','approved') // Only get approved registrations
      .order('applied_at', {ascending: true});

      if (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }

      // transform the data to match component format
      const formattedRecipients=data.map(reg => ({
        id: reg.id, // registration_id
        user_id: reg.user_id,
         name: reg.user_email?.split('@')[0] || 'Unknown User',
         email: reg.user_email || 'No email',
      status: reg.registration_status,
      payment_status: reg.payment_status,
      applied_at: reg.applied_at
      }));

      console.log(`Found ${formattedRecipients.length} approved registrations for event ${eventId}`);

      return formattedRecipients;
    } catch (error) {
        console.error('Error fetching event registrations:',error);
        throw error;
    }
};

// Get all event registrations using the view
export const getAllEventRegistrations = async () => {
  try {
    const { data, error } = await supabase
      .from('event_applications_view')
      .select('*')
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    throw error;
  }
};

// get event by ID
export const getEventById = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('events')
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
      .eq('id', eventId)
      .single();

    if (error) throw error;

    // Get registration count
    const { count, error: countError } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (countError) throw countError;

    return {
      ...data,
      registered: count || 0,
      name: data.title,
      date: data.event_date
    };
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};