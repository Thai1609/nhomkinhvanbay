import { Facebook, Instagram, Youtube, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center rounded-lg shadow-sm">
                <span className="text-white font-bold text-xl">V7</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 border-l-2 border-gray-200 pl-3">
                Nhôm kính <span className="text-sky-500">Văn Bảy</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Chuyên gia giải pháp nhôm kính chuẩn mực mới cho kiến trúc hiện đại. Đẹp – Bền – Chuẩn trong từng chi tiết thi công.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-sky-50 hover:text-sky-500 hover:border-sky-500 transition-all transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 transition-all transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-gray-900 mb-6">Liên kết nhanh</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#home" className="text-gray-500 hover:text-sky-500">Trang chủ</a></li>
              <li><a href="#services" className="text-gray-500 hover:text-sky-500">Dịch vụ</a></li>
              <li><a href="#products" className="text-gray-500 hover:text-sky-500">Sản phẩm</a></li>
              <li><a href="#contact" className="text-gray-500 hover:text-sky-500">Tư vấn báo giá</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-gray-900 mb-6">Sản phẩm chính</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="text-gray-500 hover:text-sky-500">Cửa nhôm Xingfa</a></li>
              <li><a href="#" className="text-gray-500 hover:text-sky-500">Kính cường lực</a></li>
              <li><a href="#" className="text-gray-500 hover:text-sky-500">Phòng tắm kính</a></li>
              <li><a href="#" className="text-gray-500 hover:text-sky-500">Cầu thang kính</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-gray-900 mb-6">Hỗ trợ khách hàng</h5>
            <div className="space-y-4">
              <a href="tel:0909568638" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-sky-500">
                <Phone size={16} /> 0909.568.638
              </a>
              <a href="mailto:vanbay@gmail.com" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-sky-500">
                <Mail size={16} /> vanbay@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Nhôm kính Văn Bảy. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600">Chính sách bảo mật</a>
            <a href="#" className="hover:text-gray-600">Chính sách bảo hành</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
