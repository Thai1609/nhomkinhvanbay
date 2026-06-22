import { ChangeEvent, useState, useEffect, useMemo } from "react";
import { auth, db } from "../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getPricing,
  addPricing,
  updatePricing,
  deletePricing
} from "../services/productService";
import { Product, Category, Pricing } from "../types";
import { motion } from "motion/react";
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ChevronLeft,
  Save,
  X,
  Database,
  Mail,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

export const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a")
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e")
    .replace(/i|í|ì|ỉ|ĩ|ị/g, "i")
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o")
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u")
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "pricing">(
    "products",
  );
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<(Product & { id: string })[]>([]);
  const [categories, setCategories] = useState<(Category & { id: string })[]>(
    [],
  );
  const [pricings, setPricings] = useState<(Pricing & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [loginMethod, setLoginMethod] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [editingProduct, setEditingProduct] = useState<
    (Product & { id: string }) | null
  >(null);
  const [isAdding, setIsAdding] = useState(false);

  const [editingCategory, setEditingCategory] = useState<
    (Category & { id: string }) | null
  >(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [editingPricing, setEditingPricing] = useState<(Pricing & { id: string }) | null>(null);
  const [isAddingPricing, setIsAddingPricing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "product" | "category" | "pricing";
    title: string;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Auto-dismiss status message after 4 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({
    title: "",
    slug: "",
    description: "",
    image: "",
  });

  const [pricingFormData, setPricingFormData] = useState<Partial<Pricing>>({
    title: "",
    slug: "",
    category: "",
    categorySlug: "",
    price: "",
    description: "",
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    slug: "",
    category: "",
    categorySlug: "",
    image: "",
    images: [],
    price: "Giá: Liên hệ",
    description: "",
  });

  const handleMultipleImagesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        console.warn("Bỏ qua ảnh > 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/webp", 0.7);

          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), dataUrl],
          }));
        };
        if (event.target?.result) img.src = event.target.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Always fetch products on mount for testing
    fetchProducts();
    fetchCategoriesData();
    fetchPricingData();
    return () => unsubscribe();
  }, []);

  const pricingsByCategory = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: pricings.filter(
            (item) => item.categorySlug === category.slug,
          ),
        }))
        .filter(({ items }) => items.length > 0),
    [categories, pricings],
  );

  const fetchCategoriesData = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const fetchPricingData = async () => {
    const data = await getPricing();
    setPricings(data);
  };

  const handlePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingPricing) {
        await updatePricing(editingPricing.id, pricingFormData);
      } else {
        await addPricing(pricingFormData as Pricing);
      }
      setEditingPricing(null);
      setIsAddingPricing(false);
      setPricingFormData({
        title: "",
        slug: "",
        category: "",
        categorySlug: "",
        price: "",
        description: "",
      });
      fetchPricingData();
    } catch (error) {
      console.error("Lỗi khi lưu báo giá:", error);
    }
  };

  const handlePricingEdit = (pricing: Pricing & { id: string }) => {
    setEditingPricing(pricing);
    setPricingFormData(pricing);
    setIsAddingPricing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePricingDelete = (id: string, title: string) => {
    setDeleteTarget({
      id,
      type: "pricing",
      title,
    });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    setDeleteTarget(null);
    setLoading(true);
    try {
      if (type === "pricing") {
        await deletePricing(id);
        await fetchPricingData();
        setStatusMessage({ text: "Đã xóa bản báo giá thành công!", isError: false });
      } else if (type === "category") {
        await deleteCategory(id);
        await fetchCategoriesData();
        setStatusMessage({ text: "Đã xóa danh mục thành công!", isError: false });
      } else if (type === "product") {
        await deleteProduct(id);
        await fetchProducts();
        setStatusMessage({ text: "Đã xóa sản phẩm thành công!", isError: false });
      }
    } catch (error: any) {
      console.error(`Error deleting ${type}:`, error);
      setStatusMessage({ 
        text: `Lỗi khi xóa: Bạn không có đủ quyền hạn hoặc lỗi mạng.`, 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setAuthError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Sign in error:", error);
      if (error.code === "auth/popup-blocked") {
        setAuthError(
          "Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng nhấn vào biểu tượng 'Popup blocked' trên thanh địa chỉ và chọn 'Luôn cho phép'.",
        );
      } else if (error.code === "auth/unauthorized-domain") {
        setAuthError(
          `Tên miền chưa được cấp phép. Vui lòng thêm các domain sau vào Firebase Console > Authentication > Settings > Authorized domains:\n\n1. ais-dev-akky3zdompkxzo7dbxezmo-880443526517.asia-southeast1.run.app\n2. ais-pre-akky3zdompkxzo7dbxezmo-880443526517.asia-southeast1.run.app`,
        );
      } else if (error.code === "auth/configuration-not-found") {
        setAuthError("Lỗi: Chưa bật xác thực Google trên Firebase Console.");
      } else {
        setAuthError(`Lỗi đăng nhập: ${error.message}`);
      }
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setAuthError("Email hoặc mật khẩu không chính xác.");
      } else if (error.code === "auth/operation-not-allowed") {
        setAuthError(
          "Đăng nhập bằng Email chưa được bật trong Firebase Console.",
        );
      } else {
        setAuthError(`Lỗi: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setProducts([]);
  };

  const seedPricingData = async () => {
    if (!user) {
      setStatusMessage({ text: "Vui lòng đăng nhập trước khi thực hiện", isError: true });
      return;
    }

    setLoading(true);
    try {
      // Create categories
      const categoriesToAdd = [
        { title: "Kính cường lực", slug: "kinh-cuong-luc", description: "Bảng giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3?auto=format&fit=crop&w=800&q=80" },
        { title: "Cửa kính cường lực", slug: "cua-kinh-cuong-luc", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88?auto=format&fit=crop&w=800&q=80" },
        { title: "Phòng tắm kính", slug: "phong-tam-kinh", description: "Phòng tắm kính (trọn bộ, đã gồm phụ kiện inox/bản lề kính)", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?auto=format&fit=crop&w=800&q=80" },
      ];

      for (const cat of categoriesToAdd) {
        if (!categories.find(c => c.slug === cat.slug)) {
          await addCategory(cat);
        }
      }

      // Create products
      const productsToAdd = [
        // Kính cường lực
        { title: "Kính cường lực 5mm", slug: "kinh-cuong-luc-5mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "Khoảng 230.000đ/m²", description: "Giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3?auto=format&fit=crop&w=800&q=80" },
        { title: "Kính cường lực 6mm", slug: "kinh-cuong-luc-6mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "Khoảng 260.000đ/m²", description: "Giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3?auto=format&fit=crop&w=800&q=80" },
        { title: "Kính cường lực 8mm (dùng cho phòng tắm)", slug: "kinh-cuong-luc-8mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "Khoảng 450.000đ/m²", description: "Giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3?auto=format&fit=crop&w=800&q=80" },
        { title: "Kính cường lực 10mm", slug: "kinh-cuong-luc-10mm", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "500.000đ - 850.000đ/m²", description: "500.000đ cho phòng tắm, nếu tính cả gia công ứng dụng khác dao động 650.000–850.000đ/m²", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3?auto=format&fit=crop&w=800&q=80" },
        { title: "Kính cường lực cao cấp (văn phòng, mặt dựng)", slug: "kinh-cuong-luc-cao-cap", category: "Kính cường lực", categorySlug: "kinh-cuong-luc", price: "2.200.000đ - 3.800.000đ/m²", description: "Giá kính nguyên tấm, chưa gồm công lắp đặt", image: "https://images.unsplash.com/photo-1509391366360-1e97f52cefd3?auto=format&fit=crop&w=800&q=80" },

        // Cửa kính cường lực
        { title: "Cửa kính cường lực 1 cánh mở quay", slug: "cua-1-canh-mo-quay", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "Khoảng 750.000đ/m²", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88?auto=format&fit=crop&w=800&q=80" },
        { title: "Cửa kính cường lực 2 cánh mở quay", slug: "cua-2-canh-mo-quay", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "Khoảng 770.000đ/m²", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88?auto=format&fit=crop&w=800&q=80" },
        { title: "Cửa kính cường lực 1 cánh mở lùa", slug: "cua-1-canh-mo-lua", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "Khoảng 740.000đ/m²", description: "Cửa kính cường lực trọn bộ (kính 10mm, đã gồm thi công)", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88?auto=format&fit=crop&w=800&q=80" },
        { title: "Cửa kính cường lực 2 cánh mở lùa", slug: "cua-2-canh-mo-lua", category: "Cửa kính cường lực", categorySlug: "cua-kinh-cuong-luc", price: "760.000đ - 1.050.000đ/m²", description: "Tùy đơn vị thi công và phụ kiện đi kèm. Trọn bộ kính 10mm, đã gồm thi công.", image: "https://images.unsplash.com/photo-1518386377-5056715f5d88?auto=format&fit=crop&w=800&q=80" },

        // Phòng tắm kính
        { title: "Vách phẳng 2 tấm", slug: "vach-phang-2-tam", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "2.000.000đ - 2.500.000đ/bộ", description: "Trọn bộ, đã gồm phụ kiện inox/bản lề kính", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?auto=format&fit=crop&w=800&q=80" },
        { title: "Vách 3 tấm thẳng", slug: "vach-3-tam-thang", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "2.200.000đ - 2.600.000đ/bộ", description: "Trọn bộ, đã gồm phụ kiện inox/bản lề kính", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?auto=format&fit=crop&w=800&q=80" },
        { title: "Vách góc 90 độ", slug: "vach-goc-90-do", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "Khoảng 2.500.000đ/bộ", description: "3 vách vuông góc. Trọn bộ, đã gồm phụ kiện inox/bản lề kính", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?auto=format&fit=crop&w=800&q=80" },
        { title: "Vách góc 135 độ", slug: "vach-goc-135-do", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "Khoảng 2.500.000đ/bộ", description: "Trọn bộ, đã gồm phụ kiện inox/bản lề kính", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?auto=format&fit=crop&w=800&q=80" },
        { title: "Cửa lùa ray nhôm", slug: "cua-lua-ray-nhom", category: "Phòng tắm kính", categorySlug: "phong-tam-kinh", price: "Khoảng 1.700.000đ/bộ", description: "Trọn bộ, đã gồm phụ kiện inox/bản lề kính", image: "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?auto=format&fit=crop&w=800&q=80" },
      ];

      // Create pricing data as well
      const pricingsToAdd = productsToAdd.map(({ title, slug, category, categorySlug, price, description }) => ({
        title, slug, category, categorySlug, price, description
      }));

      for (const prod of productsToAdd) {
        if (!products.find(p => p.slug === prod.slug)) {
          await addProduct(prod);
        }
      }

      for (const priceItem of pricingsToAdd) {
        if (!pricings.find(p => p.slug === priceItem.slug)) {
          await addPricing(priceItem);
        }
      }

      await fetchCategoriesData();
      await fetchProducts();
      await fetchPricingData();
      setStatusMessage({ text: "Đã thêm dữ liệu báo giá mẫu thành công!", isError: false });
    } catch (error) {
      console.error(error);
      setStatusMessage({ text: "Có lỗi xảy ra khi thêm dữ liệu mẫu", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 5MB) before processing
    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ text: "Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.", isError: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Cấu hình kích thước tối đa để giảm dung lượng file base64
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Nén ảnh dưới dạng WebP (hoặc JPEG) với chất lượng 0.8 để lưu vào document Firestore
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        setFormData({ ...formData, image: dataUrl });
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ text: "Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.", isError: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        setCategoryFormData({ ...categoryFormData, image: dataUrl });
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategorySubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryFormData);
      } else {
        await addCategory(categoryFormData as Category);
      }
      setEditingCategory(null);
      setIsAddingCategory(false);
      setCategoryFormData({
        title: "",
        slug: "",
        description: "",
      });
      fetchCategoriesData();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    }
  };

  const handleCategoryEdit = (category: Category & { id: string }) => {
    setEditingCategory(category);
    setCategoryFormData(category);
    setIsAddingCategory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryDelete = (id: string, title: string) => {
    setDeleteTarget({
      id,
      type: "category",
      title,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData as Product);
      }
      setEditingProduct(null);
      setIsAdding(false);
      setIsAddingPricing(false);
      setFormData({
        title: "",
        slug: "",
        category: "",
        categorySlug: "",
        price: "Giá: Liên hệ",
        description: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  };

  const handleEdit = (product: Product & { id: string }) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({
      id,
      type: "product",
      title,
    });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center">Quản trị viên</h1>

          <div className="flex bg-gray-50 p-1 rounded-xl mb-8">
            <button
              onClick={() => setLoginMethod("google")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === "google" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}
            >
              Google
            </button>
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === "email" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}
            >
              Tài khoản
            </button>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl leading-relaxed">
              <p className="font-bold mb-1">Cần thiết lập Firebase:</p>
              <p className="mb-2">{authError}</p>
              <div className="p-2 bg-white rounded border border-red-50 select-all font-mono text-[10px]">
                {window.location.hostname}
              </div>
              <p className="mt-2">
                Copy domain trên và dán vào <b>Authorized domains</b> trong
                Firebase Console.
              </p>
            </div>
          )}

          {loginMethod === "google" ? (
            <button
              onClick={handleSignIn}
              className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all border-2 border-black"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 bg-white rounded-full p-0.5"
              />
              Đăng nhập với Google
            </button>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 shadow-none bg-transparent">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 shadow-none bg-transparent">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                Đăng nhập
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <Link
              to="/"
              className="text-sm font-medium text-gray-400 hover:text-black"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      {/* Custom Status Toast */}
      {statusMessage && (
        <div className={`fixed top-24 right-6 z-[110] p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-center gap-3 transition-all duration-300 ${statusMessage.isError ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>
          <span className="text-sm font-bold">{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="p-1 hover:bg-black/5 rounded">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Beautiful Modular Deletion Confirmation Overlay */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setDeleteTarget(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl border border-gray-100 z-10 text-center"
          >
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Xác nhận xóa {deleteTarget.type === "pricing" ? "bản báo giá" : deleteTarget.type === "category" ? "danh mục" : "sản phẩm"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
              Bạn có chắc chắn muốn xóa bản ghi <span className="text-gray-900 font-extrabold">"{deleteTarget.title}"</span>? Hành động này không thể phục hồi.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-200 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
              >
                Xác nhận xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to="/"
                className="text-gray-400 hover:text-black transition-colors"
              >
                <ChevronLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý sản phẩm
              </h1>
            </div>
            <p className="text-gray-500 text-sm">Xin chào, {user.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSignOut}
              className="bg-white text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "products" ? "bg-black text-white shadow-lg shadow-black/20" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            Quản lý Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "categories" ? "bg-black text-white shadow-lg shadow-black/20" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            Quản lý Danh mục
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "pricing" ? "bg-black text-white shadow-lg shadow-black/20" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            Quản lý báo giá
          </button>
        </div>

        {activeTab === "products" && (
          <div>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  setIsAdding(true);
                  setEditingProduct(null);
                  setFormData({
                    title: "",
                    slug: "",
                    category: "",
                    categorySlug: "",
                    image: "",
                    price: "Giá: Liên hệ",
                    description: "",
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus size={18} /> Thêm sản phẩm
              </button>
            </div>

            {(isAdding || editingProduct) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setIsAdding(false);
                    setEditingProduct(null);
                  }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl shadow-2xl border border-gray-100"
                >
                  <button 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingProduct(null);
                    }}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-bold mb-8 pr-12 border-b pb-4">
                    {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Tên sản phẩm
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            const titleSlug = generateSlug(newTitle);
                            const finalSlug = formData.categorySlug
                              ? `${formData.categorySlug}-${titleSlug}`
                              : titleSlug;
                            setFormData({
                              ...formData,
                              title: newTitle,
                              slug: finalSlug,
                            });
                          }}
                          placeholder="VD: Cửa nhôm Xingfa hệ 55"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Slug (Đường dẫn ví dụ: cua-nhom-xingfa)
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                          placeholder="cua-nhom-xingfa"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Danh mục
                        </label>
                        <select
                          value={formData.categorySlug || ""}
                          onChange={(e) => {
                            const newCatSlug = e.target.value;
                            const selectedCat = categories.find(
                              (c) => c.slug === newCatSlug,
                            );
                            const titleSlug = generateSlug(
                              formData.title || "",
                            );
                            const finalSlug = newCatSlug
                              ? `${newCatSlug}-${titleSlug}`
                              : titleSlug;
                            setFormData({
                              ...formData,
                              category: selectedCat ? selectedCat.title : "",
                              categorySlug: newCatSlug,
                              slug: formData.title ? finalSlug : formData.slug,
                            });
                          }}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                          required
                        >
                          <option value="" disabled>
                            -- Chọn danh mục --
                          </option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                              {cat.title} ({cat.slug})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Hình ảnh đại diện
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {formData.image ? (
                              <img
                                src={formData.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Database className="text-gray-300" size={24} />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                            />
                            <p className="mt-1 text-[10px] text-gray-400">Định dạng: JPG, PNG, WEBP. Dung lượng tối đa 5MB.</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Album ảnh phụ ({formData.images?.length || 0})
                        </label>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-3">
                            {formData.images?.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={img}
                                  alt={`Album ${idx}`}
                                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                              <Plus size={20} className="text-gray-400" />
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleMultipleImagesUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Giá tham khảo
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.price || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          placeholder="VD: 750.000đ/m²"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Mô tả chi tiết
                        </label>
                        <textarea
                          rows={4}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Nhập thông số kỹ thuật, ưu điểm..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm resize-none"
                        ></textarea>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t pt-8">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdding(false);
                          setEditingProduct(null);
                        }}
                        className="px-8 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-xl font-bold text-sm bg-black text-white hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                      >
                        <Save size={18} />{" "}
                        {editingProduct ? "Cập nhật sản phẩm" : "Lưu vào hệ thống"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="font-bold text-gray-900">
                  Danh sách sản phẩm ({products.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Hình ảnh
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Tên & Danh mục
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Tạo bởi
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">
                            {product.title}
                          </p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">
                            {product.category}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="text-[10px] text-gray-500">
                            {product.createdBy || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.title)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-gray-400 italic"
                        >
                          Chưa có sản phẩm nào được tạo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Quản lý báo giá</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Cập nhật giá tham khảo cho từng sản phẩm. Dữ liệu này hiển thị trên trang Báo giá và trang danh mục.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setIsAddingPricing(true);
                      setPricingFormData({
                        title: "",
                        slug: "",
                        category: "",
                        categorySlug: "",
                        price: "Giá: Liên hệ",
                        description: "",
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Plus size={18} className="mr-2" /> Thêm báo giá
                  </button>
                </div>
              </div>
            </div>

            {isAddingPricing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsAddingPricing(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative bg-white w-full max-w-2xl p-8 rounded-3xl shadow-2xl border border-gray-100"
                >
                  <button 
                    onClick={() => setIsAddingPricing(false)}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-bold mb-8 pr-12 border-b pb-4">
                    {editingPricing ? "Cập nhật báo giá" : "Thêm báo giá mới"}
                  </h2>
                  <form onSubmit={handlePricingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Tên Hạng Mục / Sản Phẩm
                        </label>
                        <input
                          type="text"
                          required
                          value={pricingFormData.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setPricingFormData({
                              ...pricingFormData,
                              title: newTitle,
                              slug: generateSlug(newTitle),
                            });
                          }}
                          placeholder="VD: Cửa lùa 2 cánh..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Danh mục ({categories.length})
                        </label>
                        <select
                          required
                          value={pricingFormData.categorySlug || ""}
                          onChange={(e) => {
                            const catSlug = e.target.value;
                            const cat = categories.find((c) => c.slug === catSlug);
                            setPricingFormData({
                              ...pricingFormData,
                              categorySlug: catSlug,
                              category: cat ? cat.title : "",
                            });
                          }}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all appearance-none"
                        >
                          <option value="" disabled>--- Chọn danh mục ---</option>
                          {categories.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {cat.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                        Giá tham khảo
                      </label>
                      <input
                        type="text"
                        required
                        value={pricingFormData.price}
                        onChange={(e) =>
                          setPricingFormData({ ...pricingFormData, price: e.target.value })
                        }
                        placeholder="VD: 750.000đ/m²"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                        Mô tả (không bắt buộc)
                      </label>
                      <textarea
                        rows={3}
                        value={pricingFormData.description}
                        onChange={(e) =>
                          setPricingFormData({ ...pricingFormData, description: e.target.value })
                        }
                        placeholder="Có thể để trống. VD: Kính cường lực 10mm"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 mt-4 border-t pt-8">
                      <button
                        type="button"
                        onClick={() => setIsAddingPricing(false)}
                        className="px-8 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-xl font-bold text-sm bg-black text-white hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                      >
                        <Save size={18} /> Lưu báo giá
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {pricingsByCategory.length > 0 ? (
              pricingsByCategory.map(({ category, items }) => (
                <div
                  key={category.slug}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900">{category.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{category.slug}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Hạng mục
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Giá tham khảo
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {items.map((pricing) => (
                          <tr
                            key={pricing.id}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">
                                {pricing.title}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {pricing.slug}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-sky-600">{pricing.price}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handlePricingEdit(pricing)}
                                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handlePricingDelete(pricing.id, pricing.title)}
                                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm">Chưa có dữ liệu báo giá để quản lý.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "categories" && (
          <div>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  setIsAddingCategory(true);
                  setEditingCategory(null);
                  setCategoryFormData({
                    title: "",
                    slug: "",
                    description: "",
                    image: "",
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
              >
                <Plus size={18} /> Thêm danh mục
              </button>
            </div>

            {(isAddingCategory || editingCategory) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                  }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative bg-white w-full max-w-xl p-8 rounded-3xl shadow-2xl border border-gray-100"
                >
                  <button 
                    onClick={() => {
                      setIsAddingCategory(false);
                      setEditingCategory(null);
                    }}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-bold mb-8 pr-12 border-b pb-4">
                    {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                  </h2>
                  <form
                    onSubmit={handleCategorySubmit}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                        Tên Danh Mục
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryFormData.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setCategoryFormData({
                            ...categoryFormData,
                            title: newTitle,
                            slug: generateSlug(newTitle),
                          });
                        }}
                        placeholder="VD: Cửa Kính"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                        Slug (Đường dẫn ví dụ: cua-kinh)
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryFormData.slug}
                        onChange={(e) =>
                          setCategoryFormData({
                            ...categoryFormData,
                            slug: e.target.value,
                          })
                        }
                        placeholder="cua-kinh"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                        Mô tả danh mục
                      </label>
                      <textarea
                        rows={4}
                        value={categoryFormData.description}
                        onChange={(e) =>
                          setCategoryFormData({
                            ...categoryFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Nhập mô tả ngắn gọn cho danh mục..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm resize-none"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 mt-4 border-t pt-8">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setEditingCategory(null);
                        }}
                        className="px-8 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-xl font-bold text-sm bg-black text-white hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                      >
                        <Save size={18} />{" "}
                        {editingCategory ? "Cập nhật danh mục" : "Lưu danh mục"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="font-bold text-gray-900">
                  Danh sách Danh mục ({categories.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Tên Danh Mục
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">
                            {category.title}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleCategoryEdit(category)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleCategoryDelete(category.id, category.title)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-gray-400 italic"
                        >
                          Chưa có danh mục nào được tạo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
