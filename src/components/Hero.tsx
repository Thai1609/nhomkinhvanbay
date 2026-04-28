import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-wider mb-4 border border-sky-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Bền vững theo thời gian
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.2] mb-6">
              <span className="block mb-2 whitespace-nowrap tracking-tight">Kiến tạo <span className="text-sky-500 underline decoration-sky-200 underline-offset-4">Không Gian</span>,</span>
              <span className="block tracking-tight">Nâng Tầm Đẳng Cấp</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
              Giải pháp nhôm kính thế hệ mới. Tối ưu không gian, đón trọn ánh sáng và vẻ đẹp tinh tế cho ngôi nhà của bạn.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact" 
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-full text-base font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-sky-500/20"
              >
                Nhận tư vấn ngay <ArrowRight size={20} />
              </a>
              <a 
                href="#products" 
                className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-full text-base font-bold hover:border-sky-300 hover:text-sky-600 transition-all"
              >
                Xem sản phẩm
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={24} />
                <span className="text-sm font-medium text-gray-700">Thi công nhanh chóng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={24} />
                <span className="text-sm font-medium text-gray-700">Chất lượng làm nên uy tín</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mt-12 lg:mt-0 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto lg:ml-auto w-full max-w-lg lg:max-w-none">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" 
                alt="Nhôm kính cao cấp" 
                className="w-full aspect-square lg:aspect-[4/3] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-md shadow-xl p-5 rounded-xl border border-white/40">
                  <p className="text-xs font-bold text-sky-500 mb-1">Dự án tiêu biểu</p>
                  <p className="text-lg font-bold text-gray-900">Biệt thự cao cấp</p>
                </div>
              </div>
            </div>
            
            {/* Abstract element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
