import crypto from "crypto";
import { supabase } from "../config/supabase.js";

export const initiateEsewaPayment = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const user = req.user;

    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error || !event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.is_paid) {
      return res.status(400).json({ message: "This is a free event" });
    }

    const transaction_uuid = crypto.randomUUID();
    const amount = event.payment_amount;

    await supabase.from("event_registration").insert({
      event_id: eventId,
      user_id: user.id,
      transaction_id: transaction_uuid,
      payment_method: "esewa",
      payment_status: "pending",
    });

    const product_code = process.env.ESEWA_PRODUCT_CODE;

    // Signature generation
    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
      .update(message)
      .digest("base64");

    return res.json({
      success: true,
      paymentData: {
        amount,
        transaction_uuid,
        product_code,
        signature,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEsewaPayment = async (req, res, next) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({ message: "Missing data" });
    }

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    const { transaction_uuid, total_amount, product_code, status, signature } =
      decoded;

    if (status !== "COMPLETE") {
      await supabase
        .from("event_registration")
        .update({ payment_status: "failed" })
        .eq("transaction_id", transaction_uuid);

      return res.redirect("kuccapp://payment-failed");
    }
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
      .update(message)
      .digest("base64");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const { error } = await supabase
      .from("event_registration")
      .update({
        payment_status: "paid",
      })
      .eq("transaction_id", transaction_uuid);

    if (error) {
      return res.status(500).json({ message: "DB update failed" });
    }

    return res.json({
      success: true,
      message: "Payment verified",
    });
  } catch (err) {
    next(err);
  }
};

export const handleEsewaFailure = async (req, res, next) => {
  try {
    const { transaction_uuid } = req.query;

    if (transaction_uuid) {
      await supabase
        .from("event_registration")
        .update({ payment_status: "failed" })
        .eq("transaction_uuid", transaction_uuid);
    }

    return res.redirect("kuccapp://payment-failed");
  } catch (err) {
    next(err);
  }
};
