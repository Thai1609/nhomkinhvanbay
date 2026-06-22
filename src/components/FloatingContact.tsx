import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <a href="tel:0987654321" className="w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
        <Phone size={24} />
      </a>
      <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
