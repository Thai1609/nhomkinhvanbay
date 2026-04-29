import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Phone } from 'lucide-react';
import { getCategories, getProducts } from '../services/productService';
import { Category, Product } from '../types';

const normalizePrice = (price?: string) => {
  if (!price) return 'Liên hệ';
  return price.replace(/^Giá:\s*/i, '').trim() || 'Liên hệ';
};

function PricingTable({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sky-500 font-bold uppercase tracking-widest text-xs mb-2">Bảng báo giá tham khảo</p>
          <h2 className="text-2xl font-bold text-gray-900">Bảng báo giá {category.title}</h2>
        </div>
        <Link
          to={`/danh-muc/${category.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700"
        >
          Xem danh mục <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-[720px] w-full border-collapse bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-r border-gray-200 px-4 py-3 text-left font-bold text-gray-900">Hệ / danh mục</th>
              <th className="border-b border-r border-gray-200 px-4 py-3 text-left font-bold text-gray-900">Phụ kiện</th>
              <th className="border-b border-r border-gray-200 px-4 py-3 text-left font-bold text-gray-900">Hạng mục</th>
              <th className="border-b border-gray-200 px-4 py-3 text-left font-bold text-gray-900">Giá tham khảo</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.slug} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                <td className="border-r border-t border-gray-200 px-4 py-3 text-gray-700">{category.title}</td>
                <td className="border-r border-t border-gray-200 px-4 py-3 text-gray-700">Theo cấu hình</td>
                <td className="border-r border-t border-gray-200 px-4 py-3 font-medium text-gray-900">{product.title}</td>
                <td className="border-t border-gray-200 px-4 py-3 font-bold text-sky-600">{normalizePrice(product.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categoriesWithProducts = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          products: products.filter((product) => product.categorySlug === category.slug),
        }))
        .filter((item) => item.products.length > 0),
    [categories, products],
  );

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-gray-500">Đang tải bảng báo giá...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-sky-500">Trang chủ</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium">Báo giá</span>
        </div>

        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-6">
            <ArrowLeft size={16} /> Quay lại
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bảng báo giá nhôm kính</h1>
          <p className="text-gray-500 text-base max-w-3xl leading-relaxed">
            Bảng báo giá sơ bộ theo từng danh mục sản phẩm. Giá thực tế phụ thuộc vào kích thước,
            hệ nhôm, phụ kiện, loại kính và điều kiện thi công.
          </p>
        </div>

        {categoriesWithProducts.length > 0 ? (
          <div className="space-y-14">
            {categoriesWithProducts.map(({ category, products }) => (
              <PricingTable key={category.slug} category={category} products={products} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm">Hiện chưa có dữ liệu báo giá.</p>
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-sky-50 border border-sky-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3">Lưu ý</h3>
          <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <p>- Bảng báo giá chỉ mang tính tham khảo, cần đo đạc và khảo sát công trình để lên báo giá chính xác.</p>
            <p>- Đơn giá có thể thay đổi theo hệ nhôm, phụ kiện, kính cường lực, màu sơn và khối lượng thi công.</p>
            <p>- Khách hàng thi công số lượng lớn sẽ được tư vấn chính sách giá phù hợp.</p>
          </div>
          <a
            href="tel:0909568638"
            className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-sky-500/20"
          >
            <Phone size={18} /> Gọi tư vấn báo giá
          </a>
        </div>
      </div>
    </div>
  );
}
