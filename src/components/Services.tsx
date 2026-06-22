import React from 'react';
import { Compass, Hammer, Wrench, Truck } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  { 
    icon: <Compass size={24} />, 
    title: 'Tư vấn & Thiết kế', 
    description: 'Khảo sát thực tế, tư vấn giải pháp nhôm kính tối ưu nhất cho diện tích và công suất sử dụng của bạn.' 
  },
  { 
    icon: <Hammer size={24} />, 
    title: 'Thi công & Lắp đặt', 
    description: 'Đội ngũ thợ tay nghề cao, đảm bảo thi công đúng tiến độ, an toàn và thẩm mỹ tuyệt đối.' 
  },
  { 
    icon: <Wrench size={24} />, 
    title: 'Bảo trì & Sửa chữa', 
    description: 'Dịch vụ bảo trì định kỳ và sửa chữa thay thế các linh kiện, phụ kiện nhôm kính hư hỏng.' 
  },
  { 
    icon: <Truck size={24} />, 
    title: 'Vận chuyển tận nơi', 
    description: 'Hệ thống vận tải chuyên dụng đảm bảo hàng hóa đến công trình nguyên vẹn, không trầy xước.' 
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-slate-50" id="dich-vu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-sky-500 uppercase tracking-widest block mb-3">
            DỊCH VỤ CHUYÊN NGHIỆP
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Chúng tôi làm được gì cho bạn?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

