import React, { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HonestReviewPage = () => {
  const [user_name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from("reviews").insert([
      {
        user_name,
        rating,
        comment,
      },
    ]);

    setLoading(false);
    setName("");
    setRating(0);
    setComment("");
    fetchReviews();
  };

  return (
    <div
      className="min-h-screen flex justify-center items-start px-6 pt-44 pb-20 
      bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1597604396421-8ca5d6b33952?fm=jpg&q=60&w=3000')",
      }}
    >
      <motion.div
        className="max-w-3xl w-full bg-white/75 backdrop-blur-xl 
        shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-3xl 
        border border-white/40 p-8 sm:p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0A2351] 
          drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
            Honest & Review
          </h1>

          <motion.p
            className="text-[#3E3E3E] mt-3 text-lg max-w-xl mx-auto 
            tracking-wide leading-relaxed bg-white/50 backdrop-blur-sm 
            px-4 py-2 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            Bagikan pendapatmu, untuk perkembangan kami ✨
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/80 border border-[#FFE7CC] rounded-2xl 
          shadow-md p-6 space-y-6"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Nama */}
          <div>
            <label className="block font-semibold text-[#0A2351] mb-2">
              Nama
            </label>
            <input
              type="text"
              value={user_name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[#FFD8A8] bg-white/70 px-3 py-2 
              rounded-xl focus:ring-2 focus:ring-[#FFB17A]/40 outline-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block font-semibold text-[#0A2351] mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-7 h-7 cursor-pointer transition ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400 drop-shadow"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Komentar */}
          <div>
            <label className="block font-semibold text-[#0A2351] mb-2">
              Komentar
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full border border-[#FFD8A8] bg-white/70 px-3 py-2 
              rounded-xl focus:ring-2 focus:ring-[#FFB17A]/40 outline-none resize-none"
            ></textarea>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#FF7A00] text-white font-semibold
            hover:bg-[#E56A00] transition shadow-md"
          >
            {loading ? "Mengirim..." : "Kirim Review"}
          </button>
        </motion.form>

        {/* Review List */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-[#0A2351] mb-5 text-center">
            Ulasan Terbaru
          </h2>

          <AnimatePresence>
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada review</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/85 border border-[#FFE7CC] 
                    p-5 rounded-2xl shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-[#0A2351] text-lg">
                        {r.user_name}
                      </span>

                      <span className="flex items-center text-yellow-400">
                        {r.rating}
                        <Star className="w-4 h-4 ml-1 fill-yellow-400" />
                      </span>
                    </div>

                    <p className="text-gray-700">{r.comment}</p>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default HonestReviewPage;
