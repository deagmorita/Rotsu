import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../supabase-client";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const register = async ({ name, email, password }) => {
    console.log("REGISTER START", { name, email });

    try {
      console.log("Calling supabase.auth.signUp...");

      const signUpPromise = supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Auth timeout")),
          10000
        )
      );

      const { data: authData, error: authError } = await Promise.race([
        signUpPromise,
        timeoutPromise,
      ]);

      console.log("Auth response received", authData);

      if (authError) {
        console.error("Auth error:", authError);

        if (
          authError.message.includes("already registered") ||
          authError.message.includes("user_exists")
        ) {
          console.log("User exists, trying login...");

          const { data: loginData, error: loginError } =
            await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: password.trim(),
            });

          if (loginError) {
            throw new Error("Email sudah terdaftar. Silakan login.");
          }

          console.log("Login successful with existing account");
          const userData = {
            id: loginData.user.id,
            email: loginData.user.email,
            name: name,
          };
          setUser(userData);
          return userData;
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Registrasi gagal - tidak ada data user");
      }

      console.log("Auth success, user ID:", authData.user.id);

      try {
        console.log("Attempting to insert to users table...");

        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: email,
            name: name,
          })
          .select()
          .single();

        if (userError) {
          console.warn(
            "Insert warning (non-critical):",
            userError.message
          );
        } else {
          console.log("Insert success:", userData);
        }
      } catch (insertError) {
        console.warn(
          "Insert failed but continuing:",
          insertError.message
        );
      }

      const finalUser = {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
      };

      setUser(finalUser);
      console.log("REGISTER COMPLETE");
      return finalUser;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    console.log("LOGIN START", { email });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw new Error(error.message);

      // Get or create user profile
      let userProfile;
      try {
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        userProfile = profileData;
      } catch (profileError) {
        console.warn("Profile fetch failed:", profileError);
      }

      const finalUser = userProfile || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.email.split("@")[0],
      };

      setUser(finalUser);
      console.log("LOGIN SUCCESS");
      return finalUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async ({ name, password }) => {
    console.log("[UPDATE PROFILE] start", { name, password: !!password });
    try {
      if (!user || !user.id) throw new Error("User tidak terautentikasi");

      let finalUser = user;

      if (name && name !== user.name) {
        const { data, error } = await supabase
          .from("users")
          .update({ name })
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          console.error("[UPDATE PROFILE] users update error", error);
          throw error;
        }

        finalUser = data;
        console.log("[UPDATE PROFILE] users updated", data);
      }

      if (password) {
        // update password via Auth
        const { data, error } = await supabase.auth.updateUser({ password });
        if (error) {
          console.error("[UPDATE PROFILE] auth.updateUser error", error);
          throw error;
        }
        console.log("[UPDATE PROFILE] auth updated", data);
      }

      // Merge with any existing fields to avoid dropping props
      setUser({ ...user, ...finalUser });
      return { ...user, ...finalUser };
    } catch (err) {
      console.error("[UPDATE PROFILE] error", err);
      throw err;
    }
  };
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.warn("Auth init error:", error);
        } else if (authUser) {
          console.log("Initializing auth for user:", authUser.email);
          setUser({
            id: authUser.id,
            email: authUser.email,
            name: authUser.email.split("@")[0],
          });
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.email.split("@")[0],
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        updateProfile,
        logout,
        isLoggedIn: !!user,
        loading: authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
