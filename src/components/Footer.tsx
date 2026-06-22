import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      if (isHome) {
        e.preventDefault();
        let targetId = href;
        if (href === '#services') {
          targetId = '#dich-vu';
        } else if (href === '#contact') {
          targetId = '#lien-he';
        } else if (href === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          window.history.pushState(null, '', '/');
          return;
        }

        const element = document.querySelector(targetId);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          window.history.pushState(null, '', href);
        }
      }
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-16 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & Desc */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <Logo />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Chuyên gia giải pháp nhôm kính chuẩn mực mới cho kiến trúc hiện đại. Đẹp – Bền – Chuẩn trong từng chi tiết thi công.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:border-sky-500 transition-all hover:bg-sky-50"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:border-sky-500 transition-all hover:bg-sky-50"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:border-sky-500 transition-all hover:bg-sky-50"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-base tracking-wide">Liên kết nhanh</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => handleLinkClick(e, '#home')}
                  className="hover:text-sky-500 transition-colors"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => handleLinkClick(e, '#services')}
                  className="hover:text-sky-500 transition-colors"
                >
                  Dịch vụ
                </a>
              </li>
              <li>
                <a 
                  href="#products" 
                  onClick={(e) => handleLinkClick(e, '#products')}
                  className="hover:text-sky-500 transition-colors"
                >
                  Sản phẩm
                </a>
              </li>
              <li>
                <a 
                  href="#pricing" 
                  onClick={(e) => handleLinkClick(e, '#pricing')}
                  className="hover:text-sky-500 transition-colors"
                >
                  Tư vấn báo giá
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Main Products */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-base tracking-wide">Sản phẩm chính</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#products" onClick={(e) => handleLinkClick(e, '#products')} className="hover:text-sky-500 transition-colors">
                  Cửa nhôm Xingfa
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleLinkClick(e, '#products')} className="hover:text-sky-500 transition-colors">
                  Kính cường lực
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleLinkClick(e, '#products')} className="hover:text-sky-500 transition-colors">
                  Phòng tắm kính
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleLinkClick(e, '#products')} className="hover:text-sky-500 transition-colors">
                  Cầu thang kính
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-base tracking-wide">Hỗ trợ khách hàng</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-sky-500 flex-shrink-0" />
                <a href="tel:0909568638" className="hover:text-sky-500 transition-colors font-medium">
                  0909.568.638
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-sky-500 flex-shrink-0" />
                <a href="mailto:vanbay@gmail.com" className="hover:text-sky-500 transition-colors">
                  vanbay@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Nhôm Kính Văn Bảy. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-sky-500 transition-colors">Chính sách bảo mật</a>
            <span className="text-gray-200">|</span>
            <a href="#" className="hover:text-sky-500 transition-colors">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
