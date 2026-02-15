import { supabase } from "../config/supabase.js";

export const becomeMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const fullName = req.user.name;
    const { data: existing, error: checkError } = await supabase
      .from("membership_requests")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existing) {
      return res.status(400).json({
        message: "Membership request already submitted",
      });
    }

    // insert new request
    const { error } = await supabase.from("membership_requests").insert([
      {
        user_id: userId,
        full_name: fullName,
        payment_amount: 1,
        payment_method: "bank_transfer",
      },
    ]);

    if (error) {
      throw error;
    }
    return res.status(200).json({
      message: "Membership request submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const checkMembershipStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from("membership_requests")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // no request found
      return res.status(404).json({
        message: "No membership request found",
      });
    }
    let message = "";

    switch (data.status) {
      case "pending":
        message = "Membership request yet to be verified";
        break;

      case "approved":
        message = "Approved";
        break;

      case "rejected":
        message = "Rejected";
        break;

      default:
        message = "Unknown status";
    }
    const member_code = data.member_code;
    return res.status(200).json({
      status: data.status,
      message,
      member_code,
    });
  } catch (error) {
    next(error);
  }
};
