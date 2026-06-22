import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-white pt-32 pb-24 lg:pt-40 lg:pb-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Copywriting & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tag Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-600 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-sky-100 self-start shadow-sm"
            >
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></span>
              BỀN VỮNG THEO THỜI GIAN
            </motion.div>

            {/* Dynamic Typography Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight lg:leading-[1.1] mb-6"
            >
              Kiến tạo <span className="text-sky-500 relative inline-block underline decoration-sky-200 decoration-3 underline-offset-8">Không Gian</span>,
              <br />
              Nâng Tầm Đẳng Cấp
            </motion.h1>

            {/* Supporting Copywriting */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-gray-500 mb-8 leading-relaxed max-w-xl"
            >
              Giải pháp nhôm kính thế hệ mới. Tối ưu không gian, đón trọn ánh sáng và vẻ đẹp tinh tế cho ngôi nhà của bạn.
            </motion.p>

            {/* Double CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <a 
                href="#lien-he" 
                className="inline-flex items-center justify-center px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full transition-all shadow-lg shadow-sky-500/25 gap-2 group transform hover:-translate-y-0.5"
              >
                Nhận tư vấn ngay 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#products" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-bold rounded-full transition-all"
              >
                Xem sản phẩm
              </a>
            </motion.div>


          </div>

          {/* Right Column: Interactive Featured Image with Overlay Card */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" 
                alt="Thiết kế nhôm kính biệt thự cao cấp" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Glassmorphism Project Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest block mb-1">
                  Dự án tiêu biểu
                </span>
                <h4 className="text-base font-bold text-gray-900">
                  Biệt thự cao cấp
                </h4>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Atmospheric Background Ambient Blurs */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden opacity-40 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-sky-50 rounded-full blur-3xl opacity-60 absolute -top-40 -left-40"></div>
        <div className="w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 absolute top-40 -right-20"></div>
      </div>
    </section>
  );
}

