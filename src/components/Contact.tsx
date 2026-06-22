import React from 'react';
import { Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <section id="lien-he" className="py-24 bg-white border-t border-gray-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Contact Details */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-sky-500 uppercase tracking-widest block mb-3">
                ĐỒNG HÀNH CÙNG MỌI KHÔNG GIAN SỐNG
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Liên hệ để được tư vấn & thiết kế miễn phí
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Hotline Row */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 flex-shrink-0 shadow-sm">
                  <Phone size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-400">Hotline tư vấn</p>
                  <a href="tel:0909568638" className="text-xl font-bold text-gray-900 hover:text-sky-500 transition-colors block">
                    0909.568.638
                  </a>
                </div>
              </div>

              {/* Address Row */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 flex-shrink-0 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-400">Xưởng sản xuất</p>
                  <p className="text-base text-gray-700 leading-relaxed font-medium">
                    274 đường Đinh Quang Ân, Phước Tân, TP. Biên Hòa, Đồng Nai
                  </p>
                </div>
              </div>
            </div>

            {/* Zalo Premium Card */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-3xl p-8 shadow-md relative overflow-hidden group">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/10">
                    {/* SVG Zalo-like chatting logo */}
                    <span className="text-lg font-black tracking-tight select-none">Z</span>
                  </div>
                  <h3 className="text-lg font-bold">Tư vấn qua Zalo</h3>
                </div>
                <p className="text-blue-50 text-sm leading-relaxed max-w-md">
                  Trò chuyện trực tiếp với kỹ thuật viên để nhận báo giá nhanh & tư vấn giải pháp nhôm kính tối ưu nhất cho ngôi nhà của bạn.
                </p>
                <a 
                  href="https://zalo.me/0909568638" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl shadow-md transition-all text-sm"
                >
                  Mở Zalo ngay
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Column: Google Maps Location */}
          <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative bg-gray-50">
            <iframe 
              title="Địa chỉ xưởng Nhôm Kính Văn Bảy"
              src="https://maps.google.com/maps?q=274%20%C4%90inh%20Quang%20%C3%82n,%20Ph%C6%B0%E1%BB%9Bc%20T%C3%A2n,%20TP.%20Bi%C3%AAn%20H%C3%B2a,%20%C4%90%E1%BB%93ng%20Nai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[5%] hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

