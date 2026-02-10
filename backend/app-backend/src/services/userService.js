import { supabase } from "../config/supabase.js";

export const getUserFromDB = async (clerkUserId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  return { data, error };
};

export const upsertUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .upsert(userData, { onConflict: "clerk_user_id" })
    .select()
    .single();

  return { data, error };
};
