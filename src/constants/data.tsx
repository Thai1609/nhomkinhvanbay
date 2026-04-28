import { PencilRuler, ShieldCheck, Truck, Hammer } from 'lucide-react';
import { Product, Service, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    slug: 'cua-nhom',
    title: 'Cửa nhôm Xingfa',
    description: 'Hệ cửa cao cấp với độ bền vượt trội và tính thẩm mỹ cao.',
  },
  {
    slug: 'kinh-cuong-luc',
    title: 'Kính cường lực',
    description: 'Giải pháp an toàn và hiện đại cho vách ngăn, lan can.',
  },
  {
    slug: 'noi-that',
    title: 'Nội thất nhôm kính',
    description: 'Tủ bếp, tủ quần áo nhôm kính sang trọng, bền bỉ, chống mối mọt.',
  }
];

export const PRODUCTS: Product[] = [
  {
    slug: 'cua-di-4-canh-xingfa',
    title: "Cửa đi 4 cánh Xingfa",
    category: "Cửa nhôm Xingfa",
    categorySlug: "cua-nhom",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd59b3f3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497368541258-0051e70d4fbb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
    ],
    price: "Từ 1.800.000đ/m2",
    description: "Cửa đi 4 cánh mở quay hệ 55, phù hợp cho cửa chính biệt thự, nhà phố."
  },
  {
    slug: 'vach-kinh-van-phong',
    title: "Vách kính văn phòng",
    category: "Kính cường lực",
    categorySlug: "kinh-cuong-luc",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    price: "Từ 750.000đ/m2",
    description: "Vách kính cường lực 10mm-12mm, tạo không gian làm việc chuyên nghiệp."
  },
  {
    slug: 'phong-tam-kinh-dung',
    title: "Phòng tắm kính",
    category: "Kính cường lực",
    categorySlug: "kinh-cuong-luc",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
    price: "Từ 3.500.000đ/bộ",
    description: "Phòng tắm kính cường lực phụ kiện inox 304 không gỉ."
  },
  {
    slug: 'cau-thang-kinh-tay-vin-go',
    title: "Cầu thang kính",
    category: "Kính cường lực",
    categorySlug: "kinh-cuong-luc",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    price: "Từ 1.200.000đ/md",
    description: "Cầu thang kính cường lực tay vịn gỗ căm xe cao cấp."
  },
  {
    slug: 'tu-bep-nhom-cao-cap',
    title: "Tủ bếp nhôm kính",
    category: "Nội thất",
    categorySlug: "noi-that",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    price: "Từ 2.000.000đ/md",
    description: "Tủ bếp nhôm kính giả gỗ, bền bỉ không lo mối mọt."
  },
  {
    slug: 'mai-kinh-lay-sang',
    title: "Mái kính cường lực",
    category: "Kính cường lực",
    categorySlug: "kinh-cuong-luc",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    price: "Từ 1.500.000đ/m2",
    description: "Mái kính cường lực kết cấu sắt mỹ thuật hoặc inox."
  }
];

export const SERVICES: Service[] = [
  {
    icon: <PencilRuler className="text-blue-600" size={32} />,
    title: "Tư vấn & Thiết kế",
    description: "Khảo sát thực tế, tư vấn giải pháp nhôm kính tối ưu nhất cho diện tích và công suất sử dụng của bạn."
  },
  {
    icon: <Hammer className="text-blue-600" size={32} />,
    title: "Thi công & Lắp đặt",
    description: "Đội ngũ thợ tay nghề cao, đảm bảo thi công đúng tiến độ, an toàn và thẩm mỹ tuyệt đối."
  },
  {
    icon: <ShieldCheck className="text-blue-600" size={32} />,
    title: "Bảo trì & Sửa chữa",
    description: "Dịch vụ bảo trì định kỳ và sửa chữa thay thế các linh kiện, phụ kiện nhôm kính hư hỏng."
  },
  {
    icon: <Truck className="text-blue-600" size={32} />,
    title: "Vận chuyển tận nơi",
    description: "Hệ thống vận tải chuyên dụng đảm bảo hàng hóa đến công trình nguyên vẹn, không trầy xước."
  }
];
