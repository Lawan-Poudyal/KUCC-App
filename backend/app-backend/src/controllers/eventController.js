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
