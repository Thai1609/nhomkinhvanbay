import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../services/productService';
import { Product, Category } from '../types';

export default function Products() {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [displayCategories, setDisplayCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        if (productsData) setDisplayProducts(productsData);
        if (categoriesData) setDisplayCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="products" className="py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sky-500 font-bold uppercase tracking-widest text-xs mb-2">Danh mục sản phẩm</p>
            <h2 className="text-4xl font-bold text-gray-900">Giải pháp nhôm kính đa diện</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayCategories.map(cat => (
              <Link 
                key={cat.slug} 
                to={`/danh-muc/${cat.slug}`}
                className="px-4 py-2 bg-white shadow-sm hover:bg-sky-50 hover:text-sky-600 text-xs font-bold uppercase tracking-wider rounded-full transition-all border border-gray-100"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={`/san-pham/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
                    Giá: Liên hệ
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-1">{product.title}</h3>
                  <div className="w-full flex items-center justify-center gap-2 py-2 bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white rounded-xl text-xs font-bold transition-colors">
                    <Phone size={14} /> Xem chi tiết
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 p-8 bg-gradient-to-br from-sky-600 to-blue-800 rounded-3xl text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4">Bạn có yêu cầu kích thước riêng?</h3>
            <p className="text-sky-100 mb-8 max-w-xl mx-auto">
              Đừng ngần ngại liên hệ, chúng tôi chuyên gia công theo mẫu mã và yêu cầu đặc biệt của kiến trúc sư.
            </p>
            <a href="#contact" className="inline-block bg-white text-blue-700 shadow-xl px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-all">
              Gửi yêu cầu ngay
            </a>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-sky-300/20 blur-[80px] rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
