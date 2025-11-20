import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Shield } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen font-sans bg-[#FFF9F3] text-[#0A2351]">
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">

  {/* Background Image */}
  <div className="absolute inset-0">
    <img 
      src="https://images.unsplash.com/photo-1598373182308-3270495d2f58?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Roti Susu Hangat"
      className="w-full h-full object-cover"
    />

    {/* Cream–Orange Gradient (instead of black) */}
    <div className="absolute inset-0 bg-gradient-to-t 
      from-[#FFEEDC]/90 via-[#FFF4E6]/70 to-transparent">
    </div>
  </div>

  {/* HERO CONTENT */}
  <div className="relative z-10 text-center px-6">
   <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight 
    text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
  Roti Susu <span className="text-[#FF7A00] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
    Hangat
  </span><br />
  Setiap Hari di Rotsu
</h1>


    <div className="mt-10 flex flex-wrap justify-center gap-4">
      <Link 
        to="/menu" 
        className="px-8 py-3 bg-[#FF7A00] text-white font-semibold rounded-full 
        hover:bg-[#E56A00] transition"
      >
        Lihat Menu
      </Link>

      <Link 
        to="/contact" 
        className="px-8 py-3 border border-[#FF7A00] text-[#FF7A00] font-semibold rounded-full 
        hover:bg-[#FF7A00] hover:text-white transition"
      >
        Hubungi Kami
      </Link>
    </div>
  </div>

  {/* FLOATING STATS */}
  <div className="absolute bottom-10 w-full flex justify-center space-x-4 text-[#0A2351] text-sm">
    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#FFB17A40]">
      ⭐ 4.9 / 5 Rasa Favorit Pelanggan
    </div>
    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#FFB17A40]">
      Fresh Setiap Pagi
    </div>
    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#FFB17A40]">
      100% Bahan Berkualitas
    </div>
  </div>

</section>


      <section className="py-20 bg-[#FFF9F3] border-t border-[#FFE7CC] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-[#0A2351]"
          >
            Mengapa Memilih <span className="text-[#FF7A00]">Rotsu?</span>
          </motion.h2>\

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#1E2E5C] max-w-2xl mx-auto mb-12"
          >
            Kami menghadirkan cita rasa terbaik dari bahan pilihan dengan sentuhan tangan artisan.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="w-8 h-8 text-[#FF7A00]" />,
                title: "Kualitas Premium",
                desc: "Dipanggang dengan bahan terbaik dan teknik tradisional modern.",
              },
              {
                icon: <Clock className="w-8 h-8 text-[#FF7A00]" />,
                title: "Selalu Segar",
                desc: "Roti baru setiap hari, tanpa bahan pengawet, tanpa kompromi.",
              },
              {
                icon: <Shield className="w-8 h-8 text-[#FF7A00]" />,
                title: "Terpercaya",
                desc: "Dipercaya pelanggan setia di seluruh kota sebagai roti artisan terbaik.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, translateY: -6 }}
                className="p-8 border border-[#FFE7CC] rounded-2xl hover:shadow-md hover:shadow-[#FF7A0015]
                transition-all duration-300 bg-[#FFFFFF] cursor-pointer"
              >
                <motion.div whileHover={{ rotate: 8 }} className="flex justify-center mb-4">
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-[#0A2351] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#1E2E5C]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-[#FFF9F3] via-[#FFEEDC] to-[#FFD79C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,#FF7A0020_1px,transparent_1px),linear-gradient(to_bottom,#FF7A0020_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-14 px-6 relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#FF7A00] rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-all"></div>

            <img
              src="https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-4.1.0&auto=format&q=60&w=3000"
              alt="Proses Pembuatan Roti"
              className="rounded-3xl shadow-xl object-cover w-full h-[420px]
              border border-[#FFD79C] group-hover:scale-[1.02] transition-all duration-500"
            />
          </div>

          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0A2351] mb-6 leading-tight">
              Tentang{" "}
              <span className="text-[#FF7A00] relative">
                Rotsu
                <span className="absolute -bottom-1 left-0 w-20 h-[3px] bg-[#FF7A00] animate-pulse"></span>
              </span>
            </h2>

            <p className="text-[#1E2E5C] mb-5 leading-relaxed text-lg">
              Perpaduan inovasi dan tradisi dalam setiap gigitan roti kami.
            </p>

            <p className="text-[#1E2E5C] mb-10 leading-relaxed text-lg">
              Dibuat dengan semangat artisan dan bahan alami terbaik untuk rasa yang tak tergantikan.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 200 }}>
                <Link
                  to="/menu"
                  className="px-8 py-3 bg-[#FF7A00] text-white font-semibold tracking-wide rounded-full
                  hover:bg-[#E56A00] hover:shadow-xl hover:scale-105 active:scale-95
                  transition-all duration-300 flex items-center justify-center gap-2 select-none"
                >
                  Coba Sekarang
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="inline w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
