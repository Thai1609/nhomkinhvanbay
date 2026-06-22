import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone } from 'lucide-react';
import { getCategories, getPricing } from '../services/productService';
import { Category, Pricing as PricingType } from '../types';

const normalizePrice = (price?: string) => {
  if (!price) return 'Liên hệ';
  return price.replace(/^Giá:\s*/i, '').trim() || 'Liên hệ';
};

function PricingTable({
  category,
  pricings,
}: {
  category: Category;
  pricings: PricingType[];
}) {
  if (pricings.length === 0) return null;

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sky-500 font-bold uppercase tracking-widest text-xs mb-2">Bảng báo giá tham khảo</p>
          <h3 className="text-2xl font-bold text-gray-900">Bảng báo giá {category.title}</h3>
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
              <th className="border-b border-r border-gray-200 px-4 py-3 text-left font-bold text-gray-900">Mô tả</th>
              <th className="border-b border-r border-gray-200 px-4 py-3 text-left font-bold text-gray-900">Hạng mục</th>
              <th className="border-b border-gray-200 px-4 py-3 text-left font-bold text-gray-900">Giá tham khảo</th>
            </tr>
          </thead>
          <tbody>
            {pricings.map((pricing, index) => (
              <tr key={pricing.slug} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                <td className="border-r border-t border-gray-200 px-4 py-3 text-gray-700">{category.title}</td>
                <td className="border-r border-t border-gray-200 px-4 py-3 text-gray-700">{pricing.description || 'Theo cấu hình'}</td>
                <td className="border-r border-t border-gray-200 px-4 py-3 font-medium text-gray-900">{pricing.title}</td>
                <td className="border-t border-gray-200 px-4 py-3 font-bold text-sky-600">{normalizePrice(pricing.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function Pricing() {
  const [pricings, setPricings] = useState<PricingType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pricingsData, categoriesData] = await Promise.all([
          getPricing(),
          getCategories(),
        ]);
        
        setPricings(pricingsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const categoriesWithPricings = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          pricings: pricings.filter((pricing) => pricing.categorySlug === category.slug),
        }))
        .filter((item) => item.pricings.length > 0),
    [categories, pricings],
  );

  if (loading) {
    return (
      <section id="bao-gia" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">Đang tải bảng báo giá...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="bao-gia" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="text-sky-600 font-bold tracking-widest text-sm mb-3">BÁO GIÁ THAM KHẢO</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 font-display tracking-tight leading-tight">
            Bảng báo giá <span className="text-sky-600">nhôm kính</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Bảng báo giá sơ bộ theo từng danh mục sản phẩm. Giá thực tế phụ thuộc vào kích thước,
            hệ nhôm, phụ kiện, loại kính và điều kiện thi công.
          </p>
        </div>

        {categoriesWithPricings.length > 0 ? (
          <div className="space-y-14">
            {categoriesWithPricings.map(({ category, pricings }) => (
              <PricingTable key={category.slug} category={category} pricings={pricings} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm">Hiện chưa có dữ liệu báo giá.</p>
          </div>
        )}

        <div className="mt-16 rounded-3xl bg-sky-50 border border-sky-100 p-8">
          <h3 className="font-bold text-gray-900 mb-4 text-xl">Lưu ý</h3>
          <div className="space-y-3 text-base text-gray-600 leading-relaxed">
            <p>- Bảng báo giá chỉ mang tính tham khảo, cần đo đạc và khảo sát công trình để lên báo giá chính xác.</p>
            <p>- Đơn giá có thể thay đổi theo hệ nhôm, phụ kiện, kính cường lực, màu sơn và khối lượng thi công.</p>
            <p>- Khách hàng thi công số lượng lớn sẽ được tư vấn chính sách giá phù hợp.</p>
          </div>
          <a
            href="tel:0909568638"
            className="mt-6 inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-sky-600 transition-all"
          >
            <Phone size={20} /> Gọi tư vấn báo giá
          </a>
        </div>
      </div>
    </section>
  );
}
