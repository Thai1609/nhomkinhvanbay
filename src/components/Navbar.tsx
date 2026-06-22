import { motion } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Trang chủ', href: isHome ? '#home' : '/' },
    { name: 'Dịch vụ', href: isHome ? '#services' : '/#services' },
    { name: 'Sản phẩm', href: isHome ? '#products' : '/#products' },
    { name: 'Báo giá', href: isHome ? '#bao-gia' : '/#bao-gia' },
    { name: 'Liên hệ', href: isHome ? '#contact' : '/#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
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
  };

  useEffect(() => {
    if (isHome && location.hash) {
      const hash = location.hash;
      let targetId = hash;
      if (hash === '#services') {
        targetId = '#dich-vu';
      } else if (hash === '#contact') {
        targetId = '#lien-he';
      }

      const timer = setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isHome, location.hash, location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              link.href.startsWith('/') && link.href !== '/' ? (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
            <a 
              href="tel:0909568638" 
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-sky-500/20"
            >
              <Phone size={16} />
              0909.568.638
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4"
        >
          {navLinks.map((link) => (
             link.href.startsWith('/') && link.href !== '/' ? (
               <Link 
                 key={link.name}
                 to={link.href} 
                 onClick={() => setIsOpen(false)}
                 className="block text-base font-medium text-gray-600"
               >
                 {link.name}
               </Link>
             ) : (
               <a 
                 key={link.name}
                 href={link.href} 
                 onClick={(e) => handleLinkClick(e, link.href)}
                 className="block text-base font-medium text-gray-600"
               >
                 {link.name}
               </a>
             )
          ))}
          <a href="tel:0909568638" className="flex items-center gap-2 text-sky-500 font-bold">
            <Phone size={18} /> 0909.568.638
          </a>
        </motion.div>
      )}
    </nav>
  );
}
