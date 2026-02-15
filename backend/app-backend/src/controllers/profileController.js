//src/controllers/profileController.js

import { supabase } from "../config/supabase.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(404).json({
        message: "Profile not found",
        error: error.message,
      });
    }

    let imageUrl = null;

    if (data.img_path) {
      const { data: publicUrl } = supabase.storage
        .from("profile_photo")
        .getPublicUrl(data.img_path);

      imageUrl = publicUrl.publicUrl;
    }

    return res.status(200).json({
      ...data,
      imageUrl,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, program, semester, batch } = req.body;

    let imgPath = null;

    if (req.file) {
      const file = req.file;
      const filePath = `${userId}/${Date.now()}-${file.originalname}`;

      const { error: uploadError } = await supabase.storage
        .from("profile_photo")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        return res.status(400).json({
          message: "Image upload failed",
          error: uploadError.message,
        });
      }

      imgPath = filePath;
    }

    const isProfileComplete =
      name && email && phone && program && semester && batch ? true : false;

    const updateData = {
      id: userId,
      name,
      email,
      phone,
      program,
      semester,
      batch,
      is_profile_complete: isProfileComplete,
    };
    if (imgPath) {
      updateData.img_path = imgPath;
    }
    if (req.body.is_member) {
      updateData.is_member = req.body.is_member;
    }

    const { data, error } = await supabase
      .from("profile")
      .upsert(updateData, { onConflict: ["id"], returning: "representation" })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        message: "Update failed",
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: data,
    });
  } catch (err) {
    next(err);
  }
};
