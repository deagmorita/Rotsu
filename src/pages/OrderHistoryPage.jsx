import {
  Calendar,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  CreditCard,
  Wallet,
  QrCode,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import cancelIcon from "../assets/letter-x (1).png";
import reviewIcon from "../assets/review.png";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Silakan login terlebih dahulu");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("riwayat")
          .select(
            `
            id,
            qty,
            status,
            address,
            information,
            waktu_pemesanan,
            menu_id,
            user_id,
            payment_id,
            menu:menu_id (
              id,
              menu_name,
              price,
              image,
              rating
            ),
            payment:payment_id (
              id,
              payment_method
            )
          `
          )
          .eq("user_id", user.id)
          .order("waktu_pemesanan", { ascending: false });

        if (error) {
          setError("Gagal memuat riwayat pesanan");
        } else {
          const transformedOrders = (data || []).map((item) => {
            const qty = item.qty || 1;
            const totalPrice = (item.menu?.price || 0) * qty;

            return {
              id: item.id,
              waktu_pemesanan: item.waktu_pemesanan,
              status: item.status || "Sedang Disiapkan",
              qty: qty,
              nama_menu: item.menu?.menu_name || "Menu Tidak Ditemukan",
              harga: totalPrice,
              price_per_item: item.menu?.price || 0,
              image:
                item.menu?.image ||
                "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
              rating: item.menu?.rating || 0,
              address: item.address,
              payment_method: item.payment?.payment_method,
              payment_info: item.information || "",
            };
          });

          setOrders(transformedOrders);
        }
      } catch (err) {
        setError("Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filters = [
    { id: "all", name: "Semua", count: orders.length },
    {
      id: "selesai",
      name: "Selesai",
      count: orders.filter((o) => o.status === "Selesai").length,
    },
    {
      id: "proses",
      name: "Dalam Proses",
      count: orders.filter((o) =>
        ["Sedang Disiapkan", "Dalam Pengiriman"].includes(o.status)
      ).length,
    },
    {
      id: "dibatalkan",
      name: "Dibatalkan",
      count: orders.filter((o) => o.status === "Dibatalkan").length,
    },
  ];

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPopup(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrderId) return;

    try {
      const { error } = await supabase
        .from("riwayat")
        .update({ status: "Dibatalkan" })
        .eq("id", selectedOrderId);

      if (error) {
        throw error;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrderId
            ? { ...o, status: "Dibatalkan" }
            : o
        )
      );

      alert("Pesanan berhasil dibatalkan!");
      setShowPopup(false);
      setSelectedOrderId(null);
    } catch (err) {
      alert("Gagal membatalkan pesanan: " + err.message);
    }
  };

  const getFilteredOrders = () => {
    switch (filter) {
      case "selesai":
        return orders.filter((o) => o.status === "Selesai");
      case "proses":
        return orders.filter((o) =>
          ["Sedang Disiapkan", "Dalam Pengiriman"].includes(o.status)
        );
      case "dibatalkan":
        return orders.filter((o) => o.status === "Dibatalkan");
      default:
        return orders;
    }
  };

  const canCancelOrder = (orderTime) => {
    const orderDate = new Date(orderTime);
    const diffMs = currentTime - orderDate;
    const fiveMinutes = 5 * 60 * 1000;
    return diffMs <= fiveMinutes;
  };

  const getRemainingTime = (orderTime) => {
    const orderDate = new Date(orderTime);
    const diffMs = currentTime - orderDate;
    const fiveMinutes = 5 * 60 * 1000;
    const remaining = fiveMinutes - diffMs;

    if (remaining <= 0) return null;

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "sedang disiapkan":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "dalam pengiriman":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "dibatalkan":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return "bg-green-100 text-green-800";
      case "sedang disiapkan":
        return "bg-yellow-100 text-yellow-800";
      case "dalam pengiriman":
        return "bg-blue-100 text-blue-800";
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentIcon = (paymentMethod) => {
    switch (paymentMethod?.toLowerCase()) {
      case "cod":
        return <Wallet className="w-4 h-4 text-green-500" />;
      case "bank transfer":
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case "qris":
        return <QrCode className="w-4 h-4 text-purple-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod?.toLowerCase()) {
      case "cod":
        return "COD (Cash on Delivery)";
      case "bank transfer":
        return "Bank Transfer";
      case "qris":
        return "QRIS";
      default:
        return paymentMethod || "Tidak diketahui";
    }
  };

  const getPaymentInfoText = (paymentMethod, paymentInfo) => {
    if (!paymentInfo) {
      switch (paymentMethod?.toLowerCase()) {
        case "cod":
          return "Bayar saat pesanan diterima";
        default:
          return "";
      }
    }

    switch (paymentMethod?.toLowerCase()) {
      case "bank transfer":
        return `No. Rekening: ${paymentInfo}`;
      case "qris":
        return `No. Telepon: ${paymentInfo}`;
      case "cod":
        return "Bayar saat pesanan diterima";
      default:
        return paymentInfo;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat riwayat pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/menu"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Riwayat Pesanan
          </h1>
          <p className="text-gray-600">
            Kelola dan pantau semua pesanan Anda di sini
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                  filter === f.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                }`}
              >
                {f.name}
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    filter === f.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {getFilteredOrders().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Belum ada pesanan</p>
            <Link
              to="/menu"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
            >
              Mulai Pesan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredOrders().map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 min-w-[300px] max-w-full"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start space-x-4 flex-shrink-0 min-w-0">
                    <img
                      src={order.image}
                      alt={order.nama_menu}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {order.nama_menu}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(order.waktu_pemesanan).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Jumlah: {order.qty} item
                      </p>

                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        {getPaymentIcon(order.payment_method)}
                        <span className="ml-1 font-medium">Pembayaran:</span>
                        <span className="ml-1 text-blue-600 font-semibold">
                          {getPaymentMethodText(order.payment_method)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mb-1">
                        {getPaymentInfoText(order.payment_method, order.payment_info)}
                      </p>

                      {order.address && (
                        <p className="text-xs text-gray-500 truncate">
                          📍 <span className="font-bold">Alamat:</span> {order.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 flex-shrink-0">
                    <div className="flex items-center justify-between flex-nowrap min-w-[250px]">
                      <div className="flex-shrink-0">
                        <div className="flex items-center mb-2 whitespace-nowrap">
                          {getStatusIcon(order.status)}
                          <span className="ml-2 text-sm text-gray-600">
                            Status:
                          </span>
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex-shrink-0 text-end whitespace-nowrap">
                        <p className="text-sm text-gray-500 mb-1">Total</p>
                        <p
                          className={`text-xl font-bold whitespace-nowrap ${
                            order.status === "Dibatalkan"
                              ? "text-red-500 line-through"
                              : "text-blue-600"
                          }`}
                        >
                          {formatPrice(order.harga)}
                        </p>
                        {order.status === "Dibatalkan" && (
                          <p className="text-sm text-red-600 font-semibold mt-1">
                            Dibatalkan
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 min-w-[180px]">
                      {order.status === "Selesai" && (
                        <Link to="/review" className="block">
                          <button className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold text-sm">
                            <img
                              src={reviewIcon}
                              alt="review"
                              className="w-5 h-5 mr-2"
                            />
                            Ulas Kami
                          </button>
                        </Link>
                      )}

                      {order.status === "Dibatalkan" && (
                        <span className="justify-center inline-flex w-full bg-red-200 py-2 rounded-lg text-white font-extrabold">
                          Cancelled
                        </span>
                      )}

                      {order.status !== "Dibatalkan" &&
                        order.status !== "Selesai" && (
                          <div>
                            <button
                              onClick={() => handleCancelClick(order.id)}
                              disabled={!canCancelOrder(order.waktu_pemesanan)}
                              className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-semibold transition-colors duration-200 text-sm ${
                                canCancelOrder(order.waktu_pemesanan)
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <img
                                src={cancelIcon}
                                alt="cancel"
                                className="w-5 h-5 mr-2"
                              />
                              {canCancelOrder(order.waktu_pemesanan)
                                ? "Batalkan"
                                : "Tidak Bisa Dibatalkan"}
                            </button>
                            {canCancelOrder(order.waktu_pemesanan) && (
                              <p className="text-xs text-center text-gray-500 mt-2">
                                Sisa waktu:{" "}
                                {getRemainingTime(order.waktu_pemesanan)}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => {
                setShowPopup(false);
                setSelectedOrderId(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Batalkan Pesanan?
              </h2>
              <p className="text-gray-600">
                Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setSelectedOrderId(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Tidak
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;