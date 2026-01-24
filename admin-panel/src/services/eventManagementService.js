import { supabase } from "./supabaseClient";

export const getEventsWithRegistrations = async () => {
    // fetch events with payment info
    const { data: events, error } = await supabase
        .from("events")
        .select(`
            id,
            title,
            event_date,
            event_time,
            max_participants,
            status,
            created_at,
            is_paid,
            payment_amount,
            payment_methods
        `)
        .order("event_date", { ascending: true });

    if (error) throw error;

    // Process events and count registrations
    const updatedEvents = await Promise.all(
        events.map(async (event) => {
            let currentStatus = event.status;

            // auto-complete past events
            const eventDateTime = new Date(`${event.event_date}T${event.event_time}`);
            const now = new Date();

            if (event.status === "active" && eventDateTime < now) {
                await supabase
                    .from("events")
                    .update({ status: "completed" })
                    .eq("id", event.id);

                currentStatus = "completed";
            }

            // get registration count for this event
            const { count, error: countError } = await supabase
                .from("event_registrations")
                .select("*", { count: "exact", head: true })
                .eq("event_id", event.id);

            if (countError) throw countError;

            // get payment statistics
            const { data: paymentStats, error: paymentError } = await supabase
                .from("event_registrations")
                .select("payment_status, payment_amount")
                .eq("event_id", event.id);

            if (paymentError) throw paymentError;

            const paidCount = paymentStats?.filter(r => r.payment_status === 'paid').length || 0;
            const totalRevenue = paymentStats
                ?.filter(r => r.payment_status === 'paid')
                .reduce((sum, r) => sum + (parseFloat(r.payment_amount) || 0), 0) || 0;

            // return the combined object
            return {
                ...event,
                status: currentStatus,
                registered: `${count || 0}/${event.max_participants || 0}`,
                registeredCount: count || 0,
                paidCount: paidCount,
                totalRevenue: totalRevenue
            };
        })
    );
    return updatedEvents;
};