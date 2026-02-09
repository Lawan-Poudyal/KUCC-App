// services/notificationService.js
import { supabase } from "../lib/supabase.js";

export async function getNotifications(sendTo = null, priority = null) {
  let query = supabase
    .from("notifications")
    .select("id, title, message, send_to, priority, status, scheduled_at, created_at")
    .eq("status", "sent")
    .order("created_at", { ascending: false });

  if (sendTo) {
    query = query.eq("send_to", sendTo);
  }
  
  if (priority) {
    query = query.eq("priority", priority);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getUserNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, message, send_to, priority, status, scheduled_at, created_at")
    .eq("status", "sent")
    .or(`send_to.eq.all,send_to.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}