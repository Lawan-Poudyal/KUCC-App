import express from "express";
import { supabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/* GET PROFILE */
router.get("/", requireAuth, async (req, res) => {
  const user = req.user;

  // Try to fetch profile
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .maybeSingle(); // ✅ correct

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // If profile does NOT exist → create default one
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profile")
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name ?? "",
        phone: user.user_metadata?.phone ?? "",
        is_profile_complete: false,
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.json(newProfile);
  }

  // Profile exists
  res.json(profile);
});

/* UPDATE PROFILE */
router.put("/", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const updates = {
    ...req.body,
    is_profile_complete: true,
  };

  const { data, error } = await supabase
    .from("profile")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

export default router;
