import { verifyToken } from "@clerk/clerk-sdk-node";
import { supabase } from "../config/supabase.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    // 1. Verify Clerk JWT
    const { sub } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // 2. Fetch user from Supabase using clerk_user_id
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", sub)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 3. Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
