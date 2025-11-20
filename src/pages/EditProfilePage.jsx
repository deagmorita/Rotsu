import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "../context/useAuth";

const EditProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    if (password && password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        password: password || undefined,
      });
      navigate("/");
    } catch (err) {
      console.error("Update profile error", err);
      setError(err.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  <br />
  
  return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center py-16 px-6">

      <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-3xl border border-[#FFE7CC]">
        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0A2351]">
            Pengaturan Profil
          </h2>
          <p className="text-[#1E2E5C] mt-2">
            Ubah nama dan password Anda di sini.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-[#0A2351] mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-[#FF7A00]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#FFE7CC] rounded-xl 
                  bg-[#FFF9F3] text-[#0A2351]
                  focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent 
                  transition outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-[#0A2351] mb-2">
              Password Baru (opsional)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-[#FF7A00]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full pl-10 pr-12 py-3 border border-[#FFE7CC] rounded-xl
                  bg-[#FFF9F3] text-[#0A2351]
                  focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent
                  transition outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#0A2351] hover:text-[#FF7A00]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white
              bg-[#FF7A00] hover:bg-[#E56A00] 
              transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        {/* BACK BUTTON */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#1E2E5C] hover:text-[#FF7A00] transition"
          >
            ← Kembali ke beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
