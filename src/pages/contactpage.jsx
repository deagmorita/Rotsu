import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <br />
      <br />
      {/* CHAT FAQ */}
      <section className="py-24 bg-gradient-to-b from-white to-[#E6EEF6]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-[#0D2A4A] text-center mb-12"
          >
            Rotsu Q&A
          </motion.h2>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0D2A4A] text-white flex items-center justify-center rounded-full">
                🤖
              </div>
              <div>
                <p className="font-bold text-[#0D2A4A]">Rotsu Assistant</p>
                <p className="text-sm text-green-500 font-medium">Online </p>
              </div>
            </div>

            <div className="space-y-10">
              {[
                {
                  q: "Halo! Bisa pesan online gak sih?",
                  a: "Bisa dong! Kamu bisa order lewat WhatsApp, GoFood, dan GrabFood",
                },
                {
                  q: "Halal ya produknya?",
                  a: "Of course! Semua produk kami sudah tersertifikasi halal",
                },
                {
                  q: "Bayar bisa pake apa aja?",
                  a: "Cash, QRIS, e-Wallet, Transfer Bank, tinggal pilih!",
                },
                {
                  q: "Jam operasionalnya kapan?",
                  a: "Setiap hari! Jam 10.00 - 22.00 ",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3">
                  {/* Question */}
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.3 }}
                    className="self-end bg-[#0D2A4A] text-white px-5 py-3 rounded-2xl max-w-[80%] shadow-md"
                  >
                    {item.q}
                  </motion.div>

                  {/* Answer */}
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.3 + 0.5 }}
                    className="flex gap-2 bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl max-w-[85%] shadow-sm border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-[#0D2A4A] text-white rounded-full flex items-center justify-center">
                      🤖
                    </div>
                    {item.a}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <motion.a
              href="https://wa.me/628123456789"
              target="_blank"
              whileHover={{ scale: 1.08 }}
              className="px-10 py-3 bg-[#0D2A4A] text-white text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition"
            >
              Chat Admin Sekarang
            </motion.a>
          </div>
        </div>
      </section>

      <br />
      <br />
      <br />

      {/* -----FIND US------- */}

      <section className="relative bg-white py-24 overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-[#0D2A4A]/10 rounded-3xl rotate-12 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0D2A4A]/5 rounded-full blur-2xl"></div>
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 px-6">
          {/* Text Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center space-y-5"
          >
            <div className="space-y-2">
              <p className="text-sm tracking-widest font-semibold text-[#0D2A4A]/70">
                VISIT OUR PLACE
              </p>
              <h2 className="text-4xl font-extrabold text-[#0D2A4A] leading-tight">
                Temukan Suasana
                <span className="text-[#F59E0B]"> Rotsu</span> yang Nyaman
              </h2>
            </div>

            <p className="text-gray-600 text-lg max-w-md">
              Ajak keluarga, teman, atau orang spesial kamu buat dinner seru
              Lokasi mudah ditemukan parkir luas dan suasana menyenangkan!
            </p>

            <motion.a
              href="https://www.google.com/maps/place/SMK+Negeri+8+Kota+Malang/@-7.936098,112.6590688,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd6299ed2c476ad:0xfba1cc2ab944bab!8m2!3d-7.936098!4d112.6616437!16s%2Fg%2F1hm6306fr?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-[#0D2A4A] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
            >
              Buka di Google Maps
            </motion.a>
          </motion.div>

          {/* Map Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="group relative rounded-3xl overflow-hidden shadow-xl border border-gray-200"
          >
            <img
              src="https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cm90aXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000"
              alt="Lokasi Rotsu"
              className="w-full h-80 object-cover transition-transform group-hover:scale-105"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
