import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const firebaseConfig = JSON.parse(configStr);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categoriesToAdd = [
  { title: "Kính cường lực", slug: "kinh-cuong-luc", description: "Bảng giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3?auto=format&fit=crop&w=800&q=80" },
  { title: "Cửa kính cường lực", slug: "cua-kinh-cuong-luc", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88?auto=format&fit=crop&w=800&q=80" },
  { title: "Phòng tắm kính", slug: "phong-tam-kinh", description: "Phòng tắm kính (trọn bộ, đã gồm phụ kiện inox/bản lề kính)", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?auto=format&fit=crop&w=800&q=80" },
];

const productsToAdd = [
  // Kính cường lực
  { title: "Kính cường lực 5mm", slug: "kinh-cuong-luc-5mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "Khoảng 230.000đ/m²", description: "Giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3" },
  { title: "Kính cường lực 6mm", slug: "kinh-cuong-luc-6mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "Khoảng 260.000đ/m²", description: "Giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3" },
  { title: "Kính cường lực 8mm", slug: "kinh-cuong-luc-8mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "Khoảng 450.000đ/m²", description: "Dùng cho phòng tắm", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3" },
  { title: "Kính cường lực 10mm", slug: "kinh-cuong-luc-10mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "500.000đ - 850.000đ/m²", description: "500.000đ cho phòng tắm; tính cả gia công chức năng khác: 650.000–850.000đ", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3" },
  { title: "Kính cường lực cao cấp", slug: "kinh-cuong-luc-cao-cap", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "2.200.000đ - 3.800.000đ/m²", description: "Dùng cho văn phòng, mặt dựng", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3" },

  // Cửa kính cường lực
  { title: "Cửa kính cường lực 1 cánh mở quay", slug: "cua-1-canh-mo-quay", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "Khoảng 750.000đ/m²", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88" },
  { title: "Cửa kính cường lực 2 cánh mở quay", slug: "cua-2-canh-mo-quay", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "Khoảng 770.000đ/m²", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88" },
  { title: "Cửa kính cường lực 1 cánh mở lùa", slug: "cua-1-canh-mo-lua", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "Khoảng 740.000đ/m²", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88" },
  { title: "Cửa kính cường lực 2 cánh mở lùa", slug: "cua-2-canh-mo-lua", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "760.000đ - 1.050.000đ/m²", description: "Tùy đơn vị thi công và phụ kiện", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88" },

  // Phòng tắm kính
  { title: "Vách phẳng 2 tấm", slug: "vach-phang-2-tam", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "2.000.000đ - 2.500.000đ/bộ", description: "Vách phẳng 2 tấm (trọn bộ, đã gồm phụ kiện inox/bản lề kính)", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048" },
  { title: "Vách 3 tấm thẳng", slug: "vach-3-tam-thang", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "2.200.000đ - 2.600.000đ/bộ", description: "Vách 3 tấm thẳng (trọn bộ)", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048" },
  { title: "Vách góc 90 độ", slug: "vach-goc-90-do", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "Khoảng 2.500.000đ/bộ", description: "3 vách vuông góc (trọn bộ)", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048" },
  { title: "Vách góc 135 độ", slug: "vach-goc-135-do", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "Khoảng 2.500.000đ/bộ", description: "Vách góc 135 độ (trọn bộ)", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048" },
  { title: "Cửa lùa ray nhôm", slug: "cua-lua-ray-nhom", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "Khoảng 1.700.000đ/bộ", description: "Cửa lùa ray nhôm (trọn bộ)", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048" },
];

async function seed() {
  console.log("Seeding data with client sdk...");
  try {
    for (const cat of categoriesToAdd) {
      const q = query(collection(db, "categories"), where("slug", "==", cat.slug));
      const res = await getDocs(q);
      if (res.empty) {
        await addDoc(collection(db, "categories"), { ...cat, ownerId: "thaixalem367@gmail.com" });
        console.log("Added category:", cat.slug);
      }
    }

    for (const prod of productsToAdd) {
      const q = query(collection(db, "products"), where("slug", "==", prod.slug));
      const res = await getDocs(q);
      if (res.empty) {
        await addDoc(collection(db, "products"), { ...prod, ownerId: "thaixalem367@gmail.com", priceInt: 0 }); // priceInt just to satisfy schema if needed
        console.log("Added product:", prod.slug);
      }
    }
    console.log("Data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
