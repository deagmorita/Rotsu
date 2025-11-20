import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabase-client";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });
  }, []);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Gagal login: user tidak ditemukan.");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role:role_id (role_name)")
        .eq("email", user.email)
        .single();

      if (userError || !userData)
        throw new Error("Gagal menemukan data role user.");

      const role = userData.role?.role_name;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "CUSTOMER") {
        navigate("/");
      } else {
        throw new Error("Role tidak dikenali.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F3] via-[#FFEEDC] to-[#FFF4E6] flex justify-center py-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-[#FFFFFF] border border-[#FFD79C] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#FF7A00] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-2xl">R</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#0A2351]">
              Masuk ke Rotsu
            </h2>
            <p className="text-[#1E2E5C] mt-2">Selamat datang kembali!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0A2351] mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#FFD79C] rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-colors duration-200"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#0A2351] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-[#FFD79C] rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-colors duration-200"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF7A00] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#E56A00] focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#1E2E5C]">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-[#FF7A00] hover:text-[#E56A00] font-semibold"
              >
                Daftar sekarang
              </Link>
            </p>
            <div className="mt-4">
              <Link
                to="/"
                className="text-sm text-[#1E2E5C] hover:text-[#0A2351]"
              >
                ← Kembali ke beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
