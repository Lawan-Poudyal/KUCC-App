import { supabase } from "../lib/supabase";

/* LOGIN */
export const loginWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  //console.log("ACCESS TOKEN:", data.session?.access_token);

  return data;
};

/* SIGN UP */
export const signUpWithPassword = async (
  email: string,
  password: string,
  name?: string,
  phone?: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
      },
    },
  });

  if (error) throw error;
  return data;
};

/* FORGOT PASSWORD (SEND OTP / LINK) */
export const sendPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "kuccapp://reset-password",
  });

  if (error) throw error;
};

/* UPDATE PASSWORD AFTER OTP */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
};
