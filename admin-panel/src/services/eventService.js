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