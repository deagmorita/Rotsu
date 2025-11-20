import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user || null;
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role:role_id (role_name)")
        .eq("id", currentUser.id)
        .single();

      if (userError) {
        console.error("Gagal ambil role user:", userError);
      }

      setRole(userData?.role?.role_name || null);
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-500">Checking access...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
