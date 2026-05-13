import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Filter, X, Grid, List, Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCT_SPECS_CONFIG, getFilterableSpecs } from './productSpecsConfig.js';

const ProductCard = ({ product, viewMode }) => {
  const navigate = useNavigate();
  
  const handleProductClick = () => {
    const slug = product.name.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    navigate(`/${slug}-${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleProductClick}
        className="flex bg-white border rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4 space-x-4"
      >
        <img
          src={product.imageUrls?.[0] || 'https://placehold.co/150x150?text=No+Image'}
          alt={product.name}
          className="w-24 h-24 object-cover rounded flex-shrink-0"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/150x150?text=No+Image'; 
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">
                ₺{product.price?.toLocaleString('tr-TR')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₺{product.originalPrice.toLocaleString('tr-TR')}
                </span>
              )}
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? 'Stokta' : 'Stokta Yok'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleProductClick}
      className="bg-white border rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4"
    >
      <div className="relative">
        <img
          src={product.imageUrls?.[0] || 'https://placehold.co/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-40 object-cover mb-3 rounded"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/300x200?text=No+Image'; 
          }}
        />
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            İndirim
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition mb-2">
        {product.name}
      </h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-blue-600">
            ₺{product.price?.toLocaleString('tr-TR')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              ₺{product.originalPrice.toLocaleString('tr-TR')}
            </span>
          )}
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {product.stock > 0 ? 'Stokta' : 'Stokta Yok'}
        </div>
      </div>
    </div>
  );
};

const ProductFilters = ({ 
  products, 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle, 
  priceRange, 
  onPriceRangeChange 
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const getUniqueValues = (key, isArray = false) => {
    const values = new Set();
    products.forEach(product => {
      if (product[key] !== undefined && product[key] !== null) {
        if (isArray && Array.isArray(product[key])) {
          product[key].forEach(item => values.add(item));
        } else {
          values.add(product[key]);
        }
      }
    });
    return Array.from(values).sort();
  };

  const productTypes = getUniqueValues('type');
  
  const getAllFilterOptions = () => {
    const allFilters = {};
    
    productTypes.forEach(type => {
      const filterableSpecs = getFilterableSpecs(type);
      filterableSpecs.forEach(spec => {
        if (!allFilters[spec.key]) {
          allFilters[spec.key] = {
            ...spec,
            values: new Set()
          };
        }
        
        products
          .filter(p => p.type === type)
          .forEach(product => {
            const value = product[spec.key];
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach(v => allFilters[spec.key].values.add(v));
              } else {
                allFilters[spec.key].values.add(value);
              }
            }
          });
      });
    });
    
    Object.keys(allFilters).forEach(key => {
      allFilters[key].values = Array.from(allFilters[key].values).sort();
    });
    
    return allFilters;
  };

  const allFilterOptions = getAllFilterOptions();

  const handleFilterChange = (key, value, isChecked) => {
    const newFilters = { ...filters };
    
    if (!newFilters[key]) {
      newFilters[key] = [];
    }
    
    if (isChecked) {
      if (!newFilters[key].includes(value)) {
        newFilters[key] = [...newFilters[key], value];
      }
    } else {
      newFilters[key] = newFilters[key].filter(v => v !== value);
    }
    
    if (newFilters[key].length === 0) {
      delete newFilters[key];
    }
    
    onFiltersChange(newFilters);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    onPriceRangeChange({ min: 0, max: 0 });
  };

  const getActiveFilterCount = () => {
    const filterCount = Object.keys(filters).length;
    const priceFilterCount = (priceRange.min > 0 || priceRange.max > 0) ? 1 : 0;
    return filterCount + priceFilterCount;
  };

  if (!isOpen) return null;

  const prices = products.map(p => p.price || 0).filter(p => p > 0);
  const minPrice = Math.min(...prices) || 0;
  const maxPrice = Math.max(...prices) || 0;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SlidersHorizontal className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Filtreler
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Tümünü Temizle
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Fiyat Filtresi */}
        {minPrice < maxPrice && (
          <div className="space-y-3">
            <button
              onClick={() => toggleCategory('price')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-medium text-gray-900">Fiyat Aralığı</h4>
              {expandedCategories.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {(expandedCategories.price !== false) && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min || ''}
                    onChange={(e) => onPriceRangeChange({
                      ...priceRange,
                      min: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max || ''}
                    onChange={(e) => onPriceRangeChange({
                      ...priceRange,
                      max: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  ₺{minPrice.toLocaleString('tr-TR')} - ₺{maxPrice.toLocaleString('tr-TR')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Marka Filtresi */}
        {getUniqueValues('brand').length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => toggleCategory('brand')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-medium text-gray-900">Marka</h4>
              {expandedCategories.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {(expandedCategories.brand !== false) && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getUniqueValues('brand').map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.brand?.includes(brand) || false}
                      onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dinamik Özellik Filtreleri */}
        {Object.entries(allFilterOptions).map(([key, spec]) => {
          if (spec.values.length === 0) return null;
          
          return (
            <div key={key} className="space-y-3">
              <button
                onClick={() => toggleCategory(key)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900">{spec.label}</h4>
                {expandedCategories[key] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {(expandedCategories[key] !== false) && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {spec.type === 'boolean' ? (
                    <>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters[key]?.includes(true) || false}
                          onChange={(e) => handleFilterChange(key, true, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Var</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters[key]?.includes(false) || false}
                          onChange={(e) => handleFilterChange(key, false, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yok</span>
                      </label>
                    </>
                  ) : (
                    spec.values.map((value) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters[key]?.includes(value) || false}
                          onChange={(e) => handleFilterChange(key, value, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {Array.isArray(value) ? value.join(', ') : value}
                          {spec.suffix && ` ${spec.suffix}`}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const { category, categoryName, subCategory } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        let endpoint = '';

        if (categoryName) {
          console.log("Filtrelenen Ana Kategori:", categoryName);
          endpoint = `http://localhost/api/products/main-category/${encodeURIComponent(categoryName)}`;
        } else if (category) {
          endpoint = `http://localhost/api/products/category/${encodeURIComponent(category)}`;
        } else {
          endpoint = `http://localhost/api/products`;
        }

        const res = await axios.get(endpoint);
        setAllProducts(res.data);
      } catch (error) {
        console.error('Ürünler alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [category, categoryName]); 

  useEffect(() => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange.min > 0 || priceRange.max > 0) {
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        const minCheck = priceRange.min > 0 ? price >= priceRange.min : true;
        const maxCheck = priceRange.max > 0 ? price <= priceRange.max : true;
        return minCheck && maxCheck;
      });
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter(product => {
          const productValue = product[key];
          if (Array.isArray(productValue)) {
            return values.some(filterValue => productValue.includes(filterValue));
          } else {
            return values.includes(productValue);
          }
        });
      }
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return (a.price || 0) - (b.price || 0);
        case 'price-desc': return (b.price || 0) - (a.price || 0);
        case 'name':
        default: return a.name.localeCompare(b.name, 'tr');
      }
    });

    setFilteredProducts(filtered);
  }, [allProducts, filters, searchTerm, sortBy, priceRange]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const getActiveFilterCount = () => {
    const filterCount = Object.keys(filters).length;
    const priceFilterCount = (priceRange.min > 0 || priceRange.max > 0) ? 1 : 0;
    const searchFilterCount = searchTerm ? 1 : 0;
    return filterCount + priceFilterCount + searchFilterCount;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Başlık Bölümü */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryName 
            ? categoryName 
            : category 
            ? category 
            : 'Tüm Ürünler'}
        </h1>
        <p className="text-gray-600">
          {loading ? 'Yükleniyor...' : `${filteredProducts.length} ürün bulundu`}
        </p>
      </div>

      {/* Kontroller */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={toggleFilters}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filtreler</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-800 text-white px-2 py-1 rounded-full text-xs">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">İsme Göre</option>
            <option value="price-asc">Fiyat (Artan)</option>
            <option value="price-desc">Fiyat (Azalan)</option>
          </select>
          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtre Paneli */}
      {!loading && allProducts.length > 0 && (
        <ProductFilters
          products={allProducts}
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={showFilters}
          onToggle={toggleFilters}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />
      )}

      {/* Ürün Listesi */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {getActiveFilterCount() > 0 
              ? 'Filtrelere uygun ürün bulunamadı.' 
              : 'Bu kategoriye ait ürün bulunamadı.'}
          </p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={() => {
                setFilters({});
                setPriceRange({ min: 0, max: 0 });
                setSearchTerm('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;