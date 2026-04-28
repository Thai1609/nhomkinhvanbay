import { ChangeEvent, useState, useEffect } from "react";
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
} from "../services/productService";
import { Product, Category } from "../types";
import { PRODUCTS, CATEGORIES } from "../constants/data";
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
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products",
  );
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<(Product & { id: string })[]>([]);
  const [categories, setCategories] = useState<(Category & { id: string })[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<
    (Product & { id: string }) | null
  >(null);
  const [isAdding, setIsAdding] = useState(false);

  // Auth state
  const [loginMethod, setLoginMethod] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Category Form state
  const [editingCategory, setEditingCategory] = useState<
    (Category & { id: string }) | null
  >(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({
    title: "",
    slug: "",
    description: "",
    image: "",
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
    return () => unsubscribe();
  }, []);

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

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 5MB) before processing
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
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
      alert("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
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
    if (!user) {
      alert("Bạn chưa đăng nhập. Vui lòng tải lại trang và đăng nhập.");
      return;
    }

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
        image: "",
      });
      fetchCategoriesData();
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng kiểm tra quyền hạn.");
    }
  };

  const handleCategoryEdit = (category: Category & { id: string }) => {
    setEditingCategory(category);
    setCategoryFormData(category);
    setIsAddingCategory(false);
  };

  const handleCategoryDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      try {
        setLoading(true);
        await deleteCategory(id);
        await fetchCategoriesData();
      } catch (error: any) {
        console.error("Delete category error:", error);
        if (error.message?.includes("Permission denied")) {
          alert(
            "Bạn không có quyền xóa danh mục này. Chỉ quản trị viên mới có thể xóa.",
          );
        } else {
          alert(
            "Lỗi khi xóa danh mục. Vui lòng kiểm tra quyền hạn hoặc thử lại.",
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn chưa đăng nhập. Vui lòng tải lại trang và đăng nhập.");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData as Product);
      }
      setEditingProduct(null);
      setIsAdding(false);
      setFormData({
        title: "",
        slug: "",
        category: "",
        categorySlug: "",
        image: "",
        price: "Giá: Liên hệ",
        description: "",
      });
      fetchProducts();
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng kiểm tra quyền hạn.");
    }
  };

  const handleEdit = (product: Product & { id: string }) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        setLoading(true);
        await deleteProduct(id);
        await fetchProducts();
      } catch (error: any) {
        console.error("Delete product error:", error);
        if (error.message?.includes("Permission denied")) {
          alert(
            "Bạn không có quyền xóa sản phẩm này. Chỉ quản trị viên mới có thể xóa.",
          );
        } else {
          alert(
            "Lỗi khi xóa sản phẩm. Vui lòng kiểm tra quyền hạn hoặc thử lại.",
          );
        }
      } finally {
        setLoading(false);
      }
    }
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
                }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus size={18} /> Thêm sản phẩm
              </button>
            </div>

            {(isAdding || editingProduct) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
              >
                <h2 className="text-xl font-bold mb-6">
                  {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
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
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
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
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
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
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm"
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
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Hình ảnh chính (Đại diện)
                      </label>
                      <div className="flex items-center space-x-4">
                        {formData.image && (
                          <div className="relative">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, image: "" })
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Album ảnh phụ (Nhiều ảnh)
                      </label>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {formData.images?.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Album ${idx}`}
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleMultipleImagesUpload}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <p className="text-[10px] text-gray-400">
                          Chọn nhiều ảnh cùng lúc để thêm vào album.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Giá hiển thị
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="Giá: Liên hệ"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      ></textarea>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setEditingProduct(null);
                      }}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-black text-white hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                      <Save size={18} />{" "}
                      {editingProduct ? "Cập nhật" : "Lưu sản phẩm"}
                    </button>
                  </div>
                </form>
              </motion.div>
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
                        Giá
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
                        <td className="px-6 py-4 text-sm text-gray-600">
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
                              onClick={() => handleDelete(product.id)}
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
                          colSpan={5}
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
                }}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
              >
                <Plus size={18} /> Thêm danh mục
              </button>
            </div>

            {(isAddingCategory || editingCategory) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
              >
                <h2 className="text-xl font-bold mb-6">
                  {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </h2>
                <form
                  onSubmit={handleCategorySubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
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
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
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
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Mô tả danh mục
                      </label>
                      <textarea
                        rows={3}
                        value={categoryFormData.description}
                        onChange={(e) =>
                          setCategoryFormData({
                            ...categoryFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      ></textarea>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setEditingCategory(null);
                      }}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-black text-white hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                      <Save size={18} />{" "}
                      {editingCategory ? "Cập nhật" : "Lưu Danh Mục"}
                    </button>
                  </div>
                </form>
              </motion.div>
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
                              onClick={() => handleCategoryDelete(category.id)}
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
