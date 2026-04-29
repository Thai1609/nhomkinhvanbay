import { PencilRuler, ShieldCheck, Truck, Hammer } from 'lucide-react';
import { Service } from '../types';

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
