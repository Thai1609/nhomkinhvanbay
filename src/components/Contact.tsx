import { motion } from 'motion/react';
import { MapPin, Phone, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-gray-50 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <p className="text-sky-500 font-bold uppercase tracking-widest text-xs mb-3">Đồng hành cùng mọi không gian sống</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Liên hệ để được tư vấn & thiết kế miễn phí</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-sky-100 shrink-0">
                  <Phone className="text-sky-500" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Hotline tư vấn</p>
                  <p className="text-xl font-bold text-sky-600">0909.568.638</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-sky-100 shrink-0">
                  <MapPin className="text-sky-500" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Xưởng sản xuất</p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    274 đường Đinh Quang Ân, Phước Tân, TP. Biên Hòa, Đồng Nai
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl text-white relative shadow-xl shadow-sky-500/20">
              <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                <MessageSquare size={20} /> Tư vấn qua Zalo
              </h4>
              <p className="text-sky-50 mb-6 text-sm">Trò chuyện trực tiếp với kỹ thuật viên.</p>
              <button className="bg-white text-sky-600 px-6 py-3 rounded-full font-bold text-sm hover:bg-sky-50 transition-all shadow-md">
                Mở Zalo ngay
              </button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mt-12 lg:mt-0 h-[400px] rounded-3xl overflow-hidden shadow-xl border border-gray-100"
          >
            <iframe 
              src="https://www.google.com/maps?q=274%20%C4%90inh%20Quang%20%C3%82n,%20Ph%C6%B0%E1%BB%9Bc%20T%C3%A2n,%20Bi%C3%AAn%20H%C3%B2a,%20%C4%90%E1%BB%93ng%20Nai&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Nhôm kính Văn Bảy - Đồng Nai"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
