import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUri, // ✅ FIXED
    },
  });

  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectUri
  );

  if (res.type !== "success") {
    throw new Error("Google login cancelled");
  }

  // Supabase will now correctly create the session
}
