import { supabase } from "../lib/supabase";

const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
};

// export const getProfile = async () => {
//   // get logged-in user
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) throw userError || new Error("No user");

//   // fetch profile
//   const { data, error } = await supabase
//     .from("profile")
//     .select("*")
//     .eq("id", user.id)
//     .single();

//   if (error) throw error;

//   // generate public image URL if exists
//   let profileImageUrl = null;
//   if (data.img_path) {
//     const { data: img } = supabase.storage
//       .from("profile_photo")
//       .getPublicUrl(data.img_path);

//     profileImageUrl = img.publicUrl;
//   }

//   return {
//     ...data,
//     profileImage: profileImageUrl,
//   };
// };

// GET profile from backend
export const getProfile = async () => {
  const token = await getToken();

  const res = await fetch("http://localhost:8000/api/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch profile");
  }

  return res.json();
};

export const updateProfileApi = async (data: any) => {
  const res = await fetch("http://localhost:8000/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getToken()}`, // get token from supabase auth
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
