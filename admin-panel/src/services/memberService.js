import { supabase } from "./supabaseClient"

export const getApprovedMembers=async () => {
    const {data,error}= await supabase
    .from('membership_requests')
    .select(`
        id,
        full_name,
        member_code,
        payment_amount,
        payment_method,
        applied_at,
        status
        `)
        .eq("status","approved")
        .order("applied_at", {ascending: false})

        if(error) throw error;
        return data;
};