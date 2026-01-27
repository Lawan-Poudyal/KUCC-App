import { supabase } from "../lib/supabase";

export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, message, created_at")
    .eq("status", "sent")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
