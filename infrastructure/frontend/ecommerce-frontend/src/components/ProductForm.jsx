import React, { useEffect, useState } from "react";
import { productAPI } from "../services/api";
import { Package, Plus, AlertCircle, Check, Loader } from "lucide-react";

const ProductForm = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    mainCategory: "",
    category: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [mainCategoriesRes, categoriesRes] = await Promise.all([
        productAPI.get("/categories/main"),
        productAPI.get("/categories/sub")
      ]);
      
      setMainCategories(mainCategoriesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Kategori yükleme hatası:", err);
      setError("Kategoriler yüklenirken hata oluştu: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
    
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!product.name.trim()) errors.push("Ürün adı gerekli");
    if (!product.description.trim()) errors.push("Açıklama gerekli");
    if (!product.price || parseFloat(product.price) <= 0) errors.push("Geçerli fiyat gerekli");
    if (!product.stock || parseInt(product.stock) < 0) errors.push("Geçerli stok miktarı gerekli");
    if (!product.mainCategory) errors.push("Ana kategori gerekli");
    if (!product.category) errors.push("Alt kategori gerekli");
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock)
      };
      
      await productAPI.post("/", productData);
      
      setSuccess(true);
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        mainCategory: "",
        category: "",
      });
      
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error("Ürün ekleme hatası:", err);
      setError("Ürün eklenirken hata oluştu: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Yeni Ürün Ekle</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">Ürün başarıyla eklendi!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* İlk Satır */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ürün adını girin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <input
                  type="text"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ürün açıklaması"
                  required
                />
              </div>
            </div>

            {/* İkinci Satır */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Miktarı *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Kategori *
                </label>
                <select 
                  name="mainCategory" 
                  value={product.mainCategory} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  {mainCategories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Üçüncü Satır */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Kategori *
                </label>
                <select 
                  name="category" 
                  value={product.category} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setProduct({
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    mainCategory: "",
                    category: "",
                  })}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Temizle
                </button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    submitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader className="animate-spin h-4 w-4" />
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Ürünü Ekle
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Retry Button for Category Loading */}
      {error && !submitting && (
        <div className="mt-4 text-center">
          <button
            onClick={loadCategories}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Kategorileri Tekrar Yükle
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductForm;