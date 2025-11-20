import { Plus, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("original");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const { data: catData, error: catError } = await supabase
          .from("category")
          .select("id, category_name")
          .order("id");

        if (catError) {
          console.error("Error fetching categories:", catError);
          throw catError;
        }

        console.log("📁 Categories loaded:", catData);

        if (catData && catData.length > 0) {
          const cats = catData.map((cat) => ({
            id: cat.id,
            name: cat.category_name,
          }));
          setCategories(cats);
          setSelectedCategory(cats[0].id);
          console.log("✅ Selected category ID:", cats[0].id);
        }

        const { data: menuData, error: menuError } = await supabase
          .from("menu")
          .select(
            "id, menu_name, price, rating, description, image, category_id"
          )
          .order("id");

        if (menuError) {
          console.error("Error fetching menu:", menuError);
          throw menuError;
        }

        console.log("🍽️ Menu items loaded:", menuData);

        if (menuData && menuData.length > 0) {
          console.log("📊 Category IDs in menu:", [
            ...new Set(menuData.map((m) => m.category_id)),
          ]);
        }

        if (menuData) {
          setMenuItems(
            menuData.map((item) => ({
              id: item.id.toString(),
              name: item.menu_name,
              description: item.description || "Roti susu lezat",
              price: item.price,
              image:
                item.image ||
                "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
              category: item.category_id,
              rating: item.rating || 4.5,
            }))
          );
        }
      } catch (error) {
        console.error("❌ Error loading data:", error);
        setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleOpenPopup = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowPopup(true);
  };

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = existingCart.findIndex((i) => i.id === selectedItem.id);
    if (idx >= 0) existingCart[idx].quantity += quantity;
    else existingCart.push({ ...selectedItem, quantity });
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    setShowPopup(false);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    setShowCartPopup(false);
    setShowPaymentPopup(true);
  };

  const confirmPayment = async () => {
    if (!address.trim()) {
      alert("Alamat harus diisi!");
      return;
    }

    if (!paymentMethod) {
      alert("Pilih metode pembayaran!");
      return;
    }

    // Jika metode bank/qris, pastikan extraInfo diisi
    if ((paymentMethod === "2" || paymentMethod === "3") && !extraInfo.trim()) {
      alert("Nomor rekening/telepon harus diisi!");
      return;
    }

    setLoading(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const user = userData?.user;
      if (!user) {
        alert("Silakan login dulu untuk checkout.");
        setLoading(false);
        return;
      }

      const rows = cart.map((item) => ({
        user_id: user.id,
        menu_id: parseInt(item.id),
        qty: item.quantity,
        waktu_pemesanan: new Date().toISOString(),
        status: "Sedang Disiapkan",
        address,
        payment_id: parseInt(paymentMethod),
        information:
          paymentMethod === "1"
            ? null
            : paymentMethod === "2"
            ? `No Rekening: ${extraInfo}`
            : `No Telepon: ${extraInfo}`,
      }));

      const { error } = await supabase.from("riwayat").insert(rows);
      if (error) throw error;

      alert("Pesanan berhasil disimpan ke riwayat!");
      localStorage.removeItem("cart");
      setCart([]);
      setShowPaymentPopup(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat menyimpan pesanan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-8 pt-30 relative text-[#0A2351]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Menu Rotsu</h1>
          <p className="text-xl text-[#1E2E5C]">Pilih menu favoritmu</p>
          {!loading && !loadError && (
            <p className="text-sm text-gray-500 mt-2">
              Total Menu: {menuItems.length} | Kategori: {categories.length}
            </p>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF7A00] mb-4"></div>
            <p className="text-[#1E2E5C] text-lg">Memuat menu...</p>
          </div>
        )}

        {loadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
            <p className="font-semibold mb-2">⚠️ Gagal memuat data</p>
            <p className="text-sm">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <>
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-[#0A2351] text-white shadow-md"
                      : "bg-white text-[#0A2351] hover:bg-[#FFEEDC] hover:text-[#FF7A00]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#1E2E5C] text-lg mb-4">
                  Belum ada menu di kategori ini 😅
                </p>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
                  <p className="text-sm text-gray-600">🔍 Debug Info:</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected Category ID: {selectedCategory}
                  </p>
                  <p className="text-xs text-gray-500">
                    Total Menu Items: {menuItems.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    Filtered Items: {filteredItems.length}
                  </p>
                  <button
                    onClick={() => {
                      console.log("📋 Current State:");
                      console.log("Selected Category:", selectedCategory);
                      console.log("All Menu Items:", menuItems);
                      console.log("Filtered Items:", filteredItems);
                      console.log("Categories:", categories);
                    }}
                    className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Show Console Log
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-60 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm text-[#1E2E5C]">
                            {item.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-[#1E2E5C] text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="font-semibold text-lg mb-4">
                        {formatPrice(item.price)}
                      </div>
                      <button
                        onClick={() => handleOpenPopup(item)}
                        className="w-full bg-[#FF7A00] text-white py-2 rounded-lg hover:bg-[#E56A00] transition"
                      >
                        <Plus className="inline w-4 h-4 mr-1" /> Pesan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowCartPopup(true)}
            className="bg-[#FF7A00] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#E56A00] transition-all font-semibold"
          >
            🛒 Keranjang ({cart.length})
          </button>
        </div>
      </div>

      {showPopup && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-[#1E2E5C] hover:text-[#0A2351]"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>
            <p className="text-[#1E2E5C] mb-4">
              {formatPrice(selectedItem.price)}
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-4 py-2 bg-[#FFEEDC] rounded-full text-lg font-bold text-[#0A2351]"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 bg-[#FFEEDC] rounded-full text-lg font-bold text-[#0A2351]"
              >
                +
              </button>
            </div>
            <div className="text-center mb-4">
              <p className="font-semibold text-[#FF7A00] text-lg">
                Total: {formatPrice(selectedItem.price * quantity)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FF7A00] text-white py-3 rounded-lg hover:bg-[#E56A00] transition"
            >
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      )}

      {showCartPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={() => setShowCartPopup(false)}
              className="absolute top-3 right-3 text-[#1e2e5c] hover:text-[#0A2351]"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Keranjang</h2>

            {cart.length > 0 ? (
              <>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-[#1E2E5C]">
                            {item.quantity}x {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#FF7A00]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex gap-1 w-full">
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className={`mt-4 block w-4/5 text-center bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E56A00] transition ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Menyimpan..." : "Checkout"}
                  </button>
                  <button
                    onClick={clearCart}
                    disabled={loading}
                    className={`w-1/5 mt-4 block text-center bg-[#1e2e5c] text-white py-3 rounded-lg font-semibold hover:bg-[#0A2351] transition ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Clearing..." : "Clear"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[#1E2E5C] text-center">
                Keranjang masih kosong.
              </p>
            )}
          </div>
        </div>
      )}

      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={() => setShowPaymentPopup(false)}
              className="absolute top-3 right-3 text-[#1e2e5c] hover:text-[#0A2351]"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Pembayaran</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Alamat Pengiriman
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                rows="3"
                placeholder="Masukkan alamat lengkapmu..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Metode Pembayaran
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setExtraInfo("");
                }}
              >
                <option value="">Pilih Metode</option>
                <option value="1">COD (Cash On Delivery)</option>
                <option value="2">Bank Transfer</option>
                <option value="3">Qris</option>
              </select>
            </div>

            {paymentMethod === "2" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor rekening"
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
              </div>
            )}

            {paymentMethod === "3" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Nomor Telepon (Qris)
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor telepon untuk Qris"
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
              </div>
            )}

            <button
              onClick={confirmPayment}
              disabled={loading}
              className={`w-full bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E56A00] transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Menyimpan..." : "Konfirmasi Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
