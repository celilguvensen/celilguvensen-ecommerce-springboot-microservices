import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Package, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from './CartContext';
import { PRODUCT_SPECS_CONFIG } from './productSpecsConfig.js';

// Generic ProductSpecs component
const ProductSpecs = ({ product }) => {
  const config = PRODUCT_SPECS_CONFIG[product.type];
  
  if (!config) return null;

  const renderSpecValue = (spec, value) => {
    switch (spec.type) {
      case 'boolean':
        return (
          <p className="text-lg font-bold">
            {value ? (
              <span className="text-green-600">✓ Var</span>
            ) : (
              <span className="text-red-600">✗ Yok</span>
            )}
          </p>
        );
      
      case 'energy-class':
        const energyColorClass = 
          value === 'A+++' ? 'bg-green-100 text-green-800' :
          value === 'A++' ? 'bg-lime-100 text-lime-800' :
          value === 'A+' ? 'bg-yellow-100 text-yellow-800' :
          'bg-orange-100 text-orange-800';
        return (
          <p className="text-lg font-bold text-gray-900">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${energyColorClass}`}>
              {value}
            </span>
          </p>
        );
      
      case 'noise-level':
        const noiseColorClass = 
          value <= 40 ? 'bg-green-100 text-green-800' :
          value <= 45 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800';
        const noiseLabel = 
          value <= 40 ? 'Çok Sessiz' :
          value <= 45 ? 'Sessiz' : 'Orta';
        return (
          <div>
            <p className="text-lg font-bold text-gray-900">{value} dB</p>
            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${noiseColorClass}`}>
              {noiseLabel}
            </span>
          </div>
        );
      
      case 'dimensions':
        return (
          <div>
            <p className="text-lg font-bold text-gray-900">
              {spec.formatter ? spec.formatter(value) : `${value}${spec.suffix || ''}`}
            </p>
            {spec.helpText && value && (
              <p className="text-sm text-gray-500 mt-1">{spec.helpText}</p>
            )}
          </div>
        );
      
      default:
        return (
          <p className="text-lg font-bold text-gray-900">
            {value}{spec.suffix || ''}
          </p>
        );
    }
  };

  const renderSection = (section) => {
    const data = product[section.key];
    if (!data || (Array.isArray(data) || data.length === 0)) return null;

    switch (section.type) {
      case 'tags':
        return (
          <div key={section.key} className={`mt-6 p-6 bg-${section.bgColor} rounded-xl border border-${section.borderColor}`}>
            <h4 className={`font-bold text-gray-800 mb-4 flex items-center`}>
              <svg className={`w-5 h-5 mr-2 text-${section.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {section.label}
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.map((item, index) => (
                <span key={index} className={`px-4 py-2 bg-${section.tagBgColor} text-${section.tagTextColor} rounded-full font-medium`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        );

      case 'feature-list':
        return (
          <div key={section.key} className={`mt-8 p-6 bg-gradient-to-r from-${section.bgColor} to-blue-50 rounded-xl border border-${section.borderColor}`}>
            <h4 className={`font-bold text-gray-800 mb-4 flex items-center`}>
              <svg className={`w-5 h-5 mr-2 text-${section.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              {section.label}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.map((feature, index) => (
                <div key={index} className={`flex items-center p-3 bg-white rounded-lg border border-${section.borderColor} hover:border-${section.color}-300 transition-colors`}>
                  <div className={`w-2 h-2 bg-${section.color}-500 rounded-full mr-3 flex-shrink-0`}></div>
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${config.gradient} px-8 py-6`}>
        <h3 className="text-2xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
          </svg>
          {config.title}
        </h3>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.specs.map((spec) => {
            const value = product[spec.key];
            if (value === undefined || value === null) return null;
            
            return (
              <div key={spec.key} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center mb-2">
                  <div className={`w-2 h-2 bg-${spec.color}-500 rounded-full mr-3`}></div>
                  <span className="font-semibold text-gray-700">{spec.label}</span>
                </div>
                {renderSpecValue(spec, value)}
              </div>
            );
          })}
        </div>
        
        {config.sections.map(renderSection)}
      </div>
    </div>
  );
};

const ImageGallery = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const validImages = images && images.length > 0 ? images : ['https://placehold.co/400x400?text=No+Image'];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };
  
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-80 bg-gray-100 rounded-xl shadow-lg overflow-hidden group">
        <img
          src={validImages[currentImageIndex]}
          alt={`${productName} - ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/400x400?text=No+Image'; 
          }}
        />
        
        {validImages.length > 1 && validImages[0] !== 'https://placehold.co/400x400?text=No+Image' && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {validImages.length}
            </div>
          </>
        )}
        
        {!images || images.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-20 w-20 text-gray-400" />
          </div>
        )}
      </div>
      
      {validImages.length > 1 && validImages[0] !== 'https://placehold.co/400x400?text=No+Image' && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = 'https://placehold.co/60x60?text=No+Image'; 
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { slugWithId } = useParams();
  const productId = slugWithId?.split('-').pop();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost/api/products/${productId}`);
        setProduct(res.data);
        setError(null);
      } catch (err) {
        setError('Ürün getirilemedi: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol taraf - Görsel Galerisi */}
        <div>
          <ImageGallery images={product.imageUrls} productName={product.name} />
        </div>
        
        {/* Sağ taraf - Ürün Bilgileri */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-blue-600">
              ₺{product.price?.toLocaleString('tr-TR')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xl text-gray-500 line-through">
                ₺{product.originalPrice.toLocaleString('tr-TR')}
              </span>
            )}
          </div>
          
          {/* Stok Durumu */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Stokta Yok'}
            </span>
          </div>
          
          {/* Miktar Seçici ve Sepete Ekle */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">Miktar:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{addedToCart ? 'Sepete Eklendi!' : 'Sepete Ekle'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Teknik Özellikler */}
      <ProductSpecs product={product} />
    </div>
  );
};

export default ProductDetail;