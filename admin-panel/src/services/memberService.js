import { supabase } from "./supabaseClient"

/**
 * Get membership requests by status
 * @param {string} status - pending | approved | rejected
 */

// get memberships by status
export const getMembershipsByStatus=async (status) => {
    console.log('Fetching memberships with status:',status);

    // check if user is authenticated
    const {data: {user}, error:authError}= await supabase.auth.getUser();
    console.log('Current user:',user);
    console.log('Auth error:',authError);

    if(!user){
        console.error('No authenticated user found!');
        throw new Error('You must be logged in to view membership requests');
    }


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

        console.log('Response data:', data);
        console.log('Response error:',error);

        if(error) {
            console.error('Error fetching memberships:',error);
             throw error;

        }
           
        return data || [];
};

// get single membership request by ID

export const getMembershipById=async (id) => {
    console.log('Fetching membership by id:',id);

    const {data,error}=await supabase
    .from('membership_requests')
    .select(`
            id,
            user_id,
            full_name,
            member_code,
            payment_amount,
            payment_method,
            applied_at,
            status,
            reviewed_by,
            reviewed_at
        `)
        .eq('id',id)
        .single();

        console.log('Membership details:',data);
        console.log('Error:', error);

        if(error){
            console.error('Error fetching membership details:',error);
            throw error;
        }
        return data;
    
};



//approve / reject membership
export const updateMembershipStatus=async (id,status,adminId) => {
    console.log('Updating membership:', {id,status,adminId});

    const payload={
        status,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
    };

    // generate member code only on approval 
    if(status === "approved"){
        payload.member_code = `KU-${Date.now().toString().slice(-6)}`;
        console.log('Generated member code:',payload.member_code);
    }

    const {data,error}=await supabase
    .from("membership_requests")
    .update(payload)
    .eq("id",id)
    .select();

    console.log('Update response:',data);
    console.log('Update error:',error);

    if(error){
        console.error('Error updating membership:',error);
        throw error;
    }

    return true;
    
};