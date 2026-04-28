import { motion } from 'motion/react';
import { MessageSquare, MessageCircle, Phone } from 'lucide-react';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {/* Zalo Button (Blue) */}
      <motion.a
        href="https://zalo.me/0909568638"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        className="group relative flex items-center gap-2"
      >
        <span className="hidden group-hover:block absolute right-14 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
          Chat Zalo ngay
        </span>
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/20 ring-4 ring-white">
          <MessageCircle size={24} fill="currentColor" />
        </div>
      </motion.a>

      {/* Message Button (Sky Blue/Messenger style) */}
      <motion.a
        href="m.me/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        className="group relative flex items-center gap-2"
      >
        <span className="hidden group-hover:block absolute right-14 bg-sky-500 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
          Gửi tin nhắn
        </span>
        <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-sky-500/20 ring-4 ring-white">
          <MessageSquare size={24} fill="currentColor" />
        </div>
      </motion.a>

      {/* Phone Button (Black) - For mobile mostly */}
      <motion.a
        href="tel:0909568638"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        className="md:hidden group relative flex items-center gap-2"
      >
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
          <Phone size={24} fill="currentColor" />
        </div>
      </motion.a>
    </div>
  );
}
