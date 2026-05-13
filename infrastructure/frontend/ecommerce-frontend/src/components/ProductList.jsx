import { useEffect, useState } from "react";
import { Package, Eye, Search, Plus, Check, AlertCircle } from "lucide-react";
import { slugify } from "../utils/slugify";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { productAPI } from "../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  const categories = [
    { value: "", label: "Tüm Kategoriler" },
    { value: "TV", label: "TV" },
    { value: "Buzdolabı", label: "Buzdolabı" },
    { value: "Bulaşık Makinesi", label: "Bulaşık Makinesi" },
    { value: "Çamaşır Makinesi", label: "Çamaşır Makinesi" },
    { value: "Telefon", label: "Telefon" },
    { value: "PC", label: "PC" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.get('');
      setProducts(Array.isArray(response.data) ? response.data : (response.data.products || []));
    } catch (err) {
      setError("Ürünler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "" || p.category === selectedCategory)
  );

  const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const url = `/${slugify(product.name || "p")}-${product.id}`;

    const handleAdd = async (e) => {
      e.stopPropagation();
      setAdding(true);
      const res = await addToCart(product, 1);
      if (res.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }
      setAdding(false);
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="relative cursor-pointer shrink-0" onClick={() => navigate(url)}>
          <img
            src={product.imageUrls?.[0] || `https://placehold.co/200x120?text=Ürün`}
            className="w-full h-32 object-cover" 
            alt=""
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-[10px] font-bold text-red-600">STOKTA YOK</div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
             <span className="text-[9px] font-bold text-blue-500 uppercase">{product.category}</span>
             <span className="text-[9px] text-gray-400 font-medium">Stok: {product.stock}</span>
          </div>

          <h3 
            className="text-xs font-bold text-gray-800 truncate mb-1 cursor-pointer hover:text-blue-600"
            onClick={() => navigate(url)}
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-gray-500 line-clamp-1 mb-3 leading-tight flex-1">
            {product.description}
          </p>

          <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-blue-600 whitespace-nowrap">
              ₺{product.price?.toLocaleString("tr-TR")}
            </span>
            
            <div className="flex gap-1">
              <button
                onClick={() => navigate(url)}
                className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded transition-colors"
                title="Detay"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleAdd}
                disabled={adding || added || product.stock === 0}
                className={`p-1.5 rounded transition-all ${
                  added ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200"
                }`}
              >
                {adding ? <div className="h-3.5 w-3.5 animate-spin border-2 border-white border-t-transparent rounded-full" /> : 
                 added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 rounded-lg p-3 shadow-sm flex flex-col md:flex-row gap-2" style={{ backgroundColor: "#CACFC0" }}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm border-none rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="md:w-40 px-2 py-1.5 text-sm border-none rounded outline-none"
        >
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 items-stretch">
          {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default ProductList;