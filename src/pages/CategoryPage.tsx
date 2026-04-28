import { useParams, Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../constants/data';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../services/productService';
import { Product, Category } from '../types';

export default function CategoryPage() {
  const { slug } = useParams();
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        if (productsData && productsData.length > 0) {
          setDynamicProducts(productsData);
        }
        if (categoriesData && categoriesData.length > 0) {
          setDynamicCategories(categoriesData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const allProducts = dynamicProducts.length > 0 ? dynamicProducts : PRODUCTS;
  const filteredProducts = allProducts.filter(p => p.categorySlug === slug);

  const allCategories = dynamicCategories.length > 0 ? dynamicCategories : CATEGORIES;
  const category = allCategories.find(c => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy danh mục</h1>
        <Link to="/" className="text-blue-600 mt-4 inline-block">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-sky-500">Trang chủ</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium">{category.title}</span>
        </div>

        <div className="mb-12">
          <Link to="/#products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Quay lại
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.title}</h1>
          <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <Link to={`/san-pham/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                    Giá: Liên hệ
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="w-full flex items-center justify-center gap-2 py-2 bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white rounded-xl text-xs font-bold transition-all">
                    <Phone size={14} /> Xem chi tiết
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm">Hiện chưa có sản phẩm nào trong danh mục này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
