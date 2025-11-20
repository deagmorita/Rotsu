// import { MapPin, Phone, Mail, Clock } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="bg-blue-50 border-t border-blue-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="md:col-span-2">
//             <div className="flex items-center mb-4">
//               <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
//                 <span className="text-white font-bold text-lg">R</span>
//               </div>
//               <span className="text-2xl font-bold text-blue-600">Rotsu</span>
//             </div>
//             <p className="text-gray-600 mb-4 max-w-md">
//               Rotsu menyajikan roti susu segar dan lezat yang dibuat dengan
//               bahan-bahan berkualitas tinggi. Nikmati kelembutan dan rasa yang
//               tak terlupakan dalam setiap gigitan.
//             </p>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h3>
//             <div className="space-y-3">
//               <div className="flex items-center text-gray-600">
//                 <MapPin className="w-5 h-5 mr-3 text-blue-500" />
//                 <span className="text-sm">Jl. Roti Susu No. 123, Jakarta</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <Phone className="w-5 h-5 mr-3 text-blue-500" />
//                 <span className="text-sm">+62 812-3456-7890</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <Mail className="w-5 h-5 mr-3 text-blue-500" />
//                 <span className="text-sm">info@rotsu.com</span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Jam Operasional
//             </h3>
//             <div className="space-y-2">
//               <div className="flex items-center text-gray-600">
//                 <Clock className="w-5 h-5 mr-3 text-blue-500" />
//                 <div className="text-sm">
//                   <p>Senin - Jumat: 07:00 - 21:00</p>
//                   <p>Sabtu - Minggu: 08:00 - 22:00</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-blue-200 mt-8 pt-8 text-center">
//           <p className="text-gray-600 text-sm">
//             © 2024 Rotsu. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "../assets/logo/rotsu-logo.png"; // pastikan path sesuai

const Footer = () => {
  return (
    <footer className="bg-[#0E1F4A] text-[#F5F6FA] shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden mr-3 shadow-md flex items-center justify-center">
                <img
                  src={logo}
                  alt="Rotsu Logo"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">
                Rotsu
              </span>
            </div>

            <p className="text-[#C3CDE5] mb-5 max-w-md leading-relaxed">
              Rotsu menghadirkan roti susu premium dengan cita rasa lembut dan
              bahan pilihan terbaik. Setiap gigitan menghadirkan kehangatan dan
              kenikmatan sejati.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD580] mb-5 tracking-wide">
              Kontak
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-[#D9E2FA]">
                <MapPin className="w-5 h-5 mr-3 text-[#FFB84D]" />
                <span className="text-sm">Jl. Roti Susu No. 123, Jakarta</span>
              </div>
              <div className="flex items-center text-[#D9E2FA]">
                <Phone className="w-5 h-5 mr-3 text-[#FFB84D]" />
                <span className="text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center text-[#D9E2FA]">
                <Mail className="w-5 h-5 mr-3 text-[#FFB84D]" />
                <span className="text-sm">info@rotsu.com</span>
              </div>
            </div>
          </div>

          {/* Hours Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#FFD580] mb-5 tracking-wide">
              Jam Operasional
            </h3>
            <div className="space-y-2">
              <div className="flex items-start text-[#D9E2FA]">
                <Clock className="w-5 h-5 mr-3 text-[#FFB84D]" />
                <div className="text-sm leading-relaxed">
                  <p>Senin - Jumat: 07:00 - 21:00</p>
                  <p>Sabtu - Minggu: 08:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

