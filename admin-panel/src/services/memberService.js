import { supabase } from "./supabaseClient"

/**
 * Get membership requests by status
 * @param {string} status - pending | approved | rejected
 */

// get memberships by status
export const getMembershipsByStatus=async (status) => {
    const {data,error}= await supabase
    .from('membership_requests')
    .select(`
        id,
        user_id,
        full_name,
        member_code,
        payment_amount,
        payment_method,
        applied_at,
        status
        `)
        .eq("status",status)
        .order("applied_at", {ascending: false});

        if(error) throw error;
        return data;
};


//approve / reject membership
export const updateMembershipStatus=async (id,status,adminId) => {
    const payload={
        status,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
    };

    // generate member code only on approval 
    if(status === "approved"){
        payload.member_code = `KU-${Date.now().toString().slice(-6)}`;
    }

    const {error}=await supabase
    .from("membership_requests")
    .update(payload)
    .eq("id",id);

    if(error) throw error;

    return true;
    
};