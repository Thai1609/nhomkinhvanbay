import { motion } from 'motion/react';
import { SERVICES } from '../constants/data';

export default function Services() {
  return (
    <section id="services" className="py-16 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sky-500 font-bold uppercase tracking-widest text-xs mb-3"
          >
            Dịch vụ chuyên nghiệp
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900"
          >
            Chúng tôi làm được gì cho bạn?
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-sky-100 hover:-translate-y-1 transition-all group"
            >
              <div className="mb-5 p-4 bg-sky-50 rounded-xl inline-block group-hover:bg-gradient-to-br group-hover:from-sky-400 group-hover:to-blue-500 group-hover:text-white transition-all duration-300 shadow-sm text-sky-600">
                <div className="scale-90 origin-center">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
