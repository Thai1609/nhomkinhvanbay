import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Phone, MessageCircle, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProductBySlug, getProducts } from '../services/productService';
import { Product } from '../types';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [activeImage, setActiveImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (slug) {
        const foundProduct = await getProductBySlug(slug);
        setProduct(foundProduct);
        setActiveImage(foundProduct?.image);
      }
      setLoading(false);
    };
    
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (product?.categorySlug) {
        try {
          const allProducts = await getProducts();
          const filtered = allProducts.filter(p => p.categorySlug === product.categorySlug && p.slug !== slug);
          setRelatedProducts(filtered.slice(0, 5));
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchRelated();
  }, [product?.categorySlug, slug]);

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

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-xl font-bold">Không tìm thấy sản phẩm</h1>
        <Link to="/" className="text-blue-600 text-sm mt-4 inline-block">Quay lại trang chủ</Link>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])];

  return (
    <div className="pt-20 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-sky-500">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link to={`/danh-muc/${product.categorySlug}`} className="hover:text-sky-500">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        {/* Mobile Header (Back + Category) */}
        <div className="lg:hidden mb-4">
          <Link to="/#products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-3">
            <ArrowLeft size={16} /> Quay lại
          </Link>
          <p className="text-sky-500 font-bold uppercase tracking-widest text-xs mb-1">{product.category}</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start mb-20">
          {/* Hình ảnh sản phẩm & Gallery thumbnails */}
          <div>
            <motion.div
              layoutId={`img-${slug}`}
              className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm mb-4"
            >
              <img 
                src={activeImage} 
                alt={product.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            {/* Gallery thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-sky-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thông tựng sản phẩm */}
          <div className="mt-6 lg:mt-0">
            <div className="hidden lg:block">
              <Link to="/#products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4">
                <ArrowLeft size={16} /> Quay lại
              </Link>
              <p className="text-sky-500 font-bold uppercase tracking-widest text-xs mb-2">{product.category}</p>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{product.title}</h1>
            <div className="inline-block bg-sky-50 px-6 py-3 rounded-full text-sky-600 font-bold text-lg mb-8 border border-sky-100">
              {product.price || "Giá: Liên hệ"}
            </div>
            
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-10">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thông tin chi tiết</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description || "Sản phẩm cao cấp được gia công theo tiêu chuẩn kỹ thuật nghiêm ngặt. Khách hàng vui lòng liên hệ chi tiết để được tư vấn thiết kế và báo giá cho từng công trình."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:0909568638" 
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-sky-500/20"
              >
                <Phone size={18} /> Gọi tư vấn ngay
              </a>
              <a 
                href="https://zalo.me/0909568638"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white text-sky-600 border border-sky-200 px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-sky-50 transition-all"
              >
                <MessageCircle size={18} /> Chat Zalo báo giá
              </a>
            </div>
          </div>
        </div>

        {/* Section Hình ảnh thi công thực tế */}
        {allImages && allImages.length > 1 && (
          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-8 border-l-4 border-sky-500 pl-4">Hình ảnh thi công thực tế</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allImages.map((img, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
                >
                  <img 
                    src={img} 
                    alt={`Thi công ${product.title} ${idx}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((item) => (
                <Link 
                  key={item.slug} 
                  to={`/san-pham/${item.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
                    <p className="text-xs text-sky-500 font-bold">{item.price || "Giá: Liên hệ"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
