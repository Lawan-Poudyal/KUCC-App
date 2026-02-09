import { clerkClient } from "../config/clerk.js";
import { getUserFromDB, upsertUser } from "../services/userService.js";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);
    const { data: userData, error } = await getUserFromDB(userId);

    if (error && error.code !== "PGRST116") throw error;

    res.json({
      clerk: {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.unsafeMetadata?.name,
        phone: user.unsafeMetadata?.phone,
      },
      database: userData || null,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);
    const userData = {
      clerk_user_id: userId,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.unsafeMetadata?.name,
      phone: user.unsafeMetadata?.phone,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await upsertUser(userData);
    if (error) throw error;

    res.json({ success: true, user: data });
  } catch (err) {
    console.error("Error syncing user:", err);
    res
      .status(500)
      .json({ error: "Failed to sync user", details: err.message });
  }
};
