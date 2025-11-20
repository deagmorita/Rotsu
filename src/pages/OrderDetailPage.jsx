import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";

export default function OrderDetailPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);

    let i = 0;
    const timer = setInterval(() => {
      i += 5;
      setProgress(i);
      if (i >= 100) {
        clearInterval(timer);
        setTimeout(async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            alert("Kamu belum login!");
            setIsCheckingOut(false);
            return;
          }

          const rows = cartItems.map((item) => ({
            user_id: user.id,
            menu_id: parseInt(item.id),
            qty: item.quantity,
            waktu_pemesanan: new Date().toISOString(),
            status: "Sedang Disiapkan",
          }));

          const { data, error } = await supabase
            .from("riwayat")
            .insert(rows);

          if (error) {
            console.error("❌ Gagal menyimpan ke Supabase:", error);
            alert(`Terjadi error saat checkout: ${error.message}`);
          } else {
            console.log("✅ Data berhasil masuk:", data);
            setShowSuccessPopup(true);
          }

          setCartItems([]);
          localStorage.removeItem("cart");
          setIsCheckingOut(false);
          setProgress(0);
        }, 500);
      }
    }, 120);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
        <ShoppingCart className="text-blue-600" />
        Detail Pemesanan
      </h1>

      <AnimatePresence>
        {isCheckingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <h2 className="text-xl font-semibold mb-4">
                Pesanan Sedang Diproses...
              </h2>
              <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-blue-600"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="text-sm text-gray-500">{progress}%</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-8 rounded-2xl shadow-lg text-center"
            >
              <h2 className="text-2xl font-semibold text-green-600 mb-3">
                ✅ Pesanan Berhasil!
              </h2>
              <p className="text-gray-600 mb-5">
                Pesananmu sudah disimpan ke riwayat. Terima kasih 🫶
              </p>
              <Link
                to="/history"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
              >
                Lihat Riwayat
              </Link>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="ml-3 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {cartItems.length === 0 && !isCheckingOut ? (
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">Keranjang kamu masih kosong 😢</p>
          <Link
            to="/menu"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
          >
            Pesan Sekarang
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6">
          {cartItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center border-b py-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.quantity}x {formatPrice(item.price)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          ))}

          <div className="mt-4 pt-4 border-t flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-blue-600">{formatPrice(totalPrice)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Konfirmasi Pesanan
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/menu"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              ← Kembali ke Menu
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}