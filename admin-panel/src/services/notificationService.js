import { supabase } from "./supabaseClient"

export const createNotification=async (payload) => {
    const {data,error}=await supabase
    .from("notifications")
    .insert(payload)
    .select()
    .single()

    if(error) throw error;
    return data;
};

export const getNotifications=async () => {
    const {data,error}=await supabase
    .from("notifications")
    .select('*')
    .order("created_at" ,{ascending:false})

    if(error) throw error;
    return data;
};