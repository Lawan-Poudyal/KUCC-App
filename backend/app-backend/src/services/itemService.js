import supabase from "../config/supabase.js";

export const getUserItems = async (userId) => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const createItem = async ({ userId, title, description }) => {
  const { data, error } = await supabase
    .from("items")
    .insert([
      {
        user_id: userId,
        title,
        description,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { data, error };
};
