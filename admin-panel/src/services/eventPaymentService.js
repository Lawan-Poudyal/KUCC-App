import { supabase } from "./supabaseClient";

// get all event applications with payment details
export const getAllEventApplications=async () => {
    const {data,error}=await supabase
    .from('event_applications_view')
    .select('*')
    .order('applied_at', {ascending:false});

       if (error) {
        console.error('Error fetching all applications:', error);
        throw error;
    }
        return data || [];
    
};

// get applications for a specific event
export const getEventApplications=async (eventId) => {
    if (!eventId) {
        throw new Error('Event ID is required');
    }
    const {data,error}=await supabase
    .from('event_applications_view')
    .select('*')
    .eq('event_id',eventId)
     .order('applied_at', { ascending: false });
     if (error) {
        console.error('Error fetching event applications:', error);
        throw error;
    }
    
    return data || [];
    
};

// update payment status
export const updatePaymentStatus=async (registrationId, paymentData) => {
    if (!registrationId) {
        throw new Error('Registration ID is required');
    }
const {error}=await supabase
.from('event_registrations')  
.update({
    payment_status:paymentData.payment_status,
    payment_method:paymentData.payment_method,
    payment_amount: paymentData.payment_amount ? parseFloat(paymentData.payment_amount) : null,
    paid_at: paymentData.payment_status === 'paid' ? new Date().toISOString() : null,
    transaction_id: paymentData.transaction_id || null 
})  
.eq('id',registrationId);

if (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
};

// Update event payment settings
export const updateEventPaymentSettings=async (eventId,paymentSettings) => {
    if (!eventId) {
        throw new Error('Event ID is required');
    }
    const {error}= await supabase
    .from('events')
    .update({
        is_paid: paymentSettings.is_paid,
        payment_amount: paymentSettings.payment_amount ? parseFloat(paymentSettings.payment_amount) : null,
        payment_methods: paymentSettings.payment_methods
    })
    .eq('id',eventId);

    if (error) {
        console.error('Error updating event payment settings:', error);
        throw error;
    } 
};

// get payment statistics for an event
export const getEventPaymentStats=async (eventId) => {
    if (!eventId) {
        throw new Error('Event ID is required');
    }

    const {data,error}=await supabase
    .from('event_applications_view')
    .select('payment_status, payment_amount')
    .eq('event_id',eventId);

    if (error) {
        console.error('Error fetching payment stats:', error);
        throw error;
    }

    const stats={
        total:data?.length || 0,
        paid:data?.filter(r=>r.payment_status === 'paid').length,
        unpaid: data?.filter(r=> r.payment_status === 'unpaid').length,
        pending: data?.filter(r=> r.payment_status === 'pending').length,
        refunded: data?.filter(r => r.payment_status === 'refunded').length || 0,
        totalRevenue: data
        ?.filter(r=>r.payment_status === 'paid')
        .reduce((sum,r)=> sum + (parseFloat(r.payment_amount) || 0),0)
    };
    return stats;
    
};

// bulk update payment status
export const bulkUpdatePaymentStatus=async (registrationIds,paymentStatus) => {
    if (!registrationIds || registrationIds.length === 0) {
        throw new Error('Registration IDs are required');
    }
    const{error}=await supabase
    .from('event_registrations')
    .update({
        payment_status: paymentStatus,
        paid_at: paymentStatus === 'paid' ? new Date().toISOString():null 
    })
    .in('id',registrationIds);

    if (error) {
        console.error('Error bulk updating payment status:', error);
        throw error;
    }
    
};