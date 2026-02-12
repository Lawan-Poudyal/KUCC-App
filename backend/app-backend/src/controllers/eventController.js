//app-backend/src/controllers/eventController.js

import { supabase } from "../config/supabase.js";

export const getAllPublishedEvents = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .neq("status", "draft")
      .order("event_date", { ascending: true });

    if (error) {
      // Pass error to Express error handler
      return next(new Error(`Failed to fetch events: ${error.message}`));
    }
    res.status(200).json({
      success: true,
      totalEvents: data?.length || 0,
      events: data,
    });
  } catch (err) {
    next(err);
  }
};

export const getEventbyID = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return next(new Error(`Failed to fetch event ${id}: ${error.message}`));
    }

    if (!event) return next(new Error(`Event not found`));

    return res.json({
      success: true,
      event,
    });
  } catch (error) {
    next(err);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const user = req.user; // from authMiddleware
    const { eventId, payment_method } = req.body;

    // 1️⃣ Get event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2️⃣ Prevent registration for completed events
    if (event.status === "completed") {
      return res.status(400).json({
        message: "Cannot register for completed event",
      });
    }

    // 3️⃣ Check duplicate registration
    const { data: existing } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    // 4️⃣ Determine payment status
    let payment_status = null;

    if (event.is_paid) {
      if (!payment_method) {
        return res.status(400).json({
          message: "Payment method required",
        });
      }

      if (payment_method === "Cash") {
        payment_status = "unpaid";
      } else if (payment_method === "Online") {
        payment_status = "paid"; // temporary until Khalti
      }
    }

    // 5️⃣ Insert registration
    const { error: insertError } = await supabase
      .from("event_registrations")
      .insert([
        {
          event_id: eventId,
          user_id: user.id,
          payment_method: event.is_paid ? payment_method : null,
          payment_status: event.is_paid ? payment_status : null,
        },
      ]);

    if (insertError) {
      return next(new Error(`Failed to register: ${insertError.message}`));
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    next(err);
  }
};
