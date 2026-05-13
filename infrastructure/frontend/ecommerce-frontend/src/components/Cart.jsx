import React, { useEffect } from 'react';
import { Package, Plus, Minus, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    getTotalItems, 
    clearCart, 
    loading, 
    error, 
    clearError,
    refetchCart,
    cartLoaded
  } = useCart();

  useEffect(() => {
    const initializeCart = async () => {
      const token = getAuthToken();
      if (!token && !loading && cartLoaded && cartItems.length === 0) {
        console.log("Cart page opened without token, initializing guest cart...");
        await refetchCart();
      }
    };
    initializeCart();
  }, []);

  useEffect(() => {
    if (!loading && error) {
      refetchCart();
    }
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost';
    
    if (imagePath.startsWith('/')) {
      return `${baseUrl}${imagePath}`;
    }
    
    return `${baseUrl}/${imagePath}`;
  };

  const handleBack = () => navigate('/');

  // Loading state
  if (loading && !cartLoaded) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Sepet yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Bir hata oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => {
                clearError();
                refetchCart();
              }} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
            <button 
              onClick={handleBack} 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Alışverişe Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)]">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Sepetiniz boş</h2>
          <p className="text-gray-500 mb-8">Alışverişe başlamak için ürünleri sepetinize ekleyin</p>
          <button 
            onClick={handleBack} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return numPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2});
  };

  return (
    <div className="min-h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Sepetim ({getTotalItems()} ürün)</h2>
              <button 
                onClick={clearCart} 
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Sepeti Boşalt
              </button>
            </div>
          </div>
          
          <div className="divide-y">
            {cartItems.map(item => {
              const imageUrl = getImageUrl(item.productImage);
              
              return (
                <div key={item.productId} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden relative">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={item.productName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image load error:', imageUrl);
                              e.target.style.display = 'none';
                              const iconElement = e.target.parentElement.querySelector('.fallback-icon');
                              if (iconElement) iconElement.style.display = 'block';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', imageUrl);
                            }}
                          />
                        ) : null}
                        <Package 
                          className="fallback-icon h-8 w-8 text-gray-400 absolute" 
                          style={{display: imageUrl ? 'none' : 'block'}} 
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                        {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                        {item.category && <p className="text-xs text-gray-400">{item.category}</p>}
                        <p className="text-blue-600 font-bold text-lg mt-1">
                          ₺{formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg">
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="font-bold text-lg">
                        ₺{formatPrice((typeof item.price === 'number' ? item.price : parseFloat(item.price)) * item.quantity)}
                      </p>

                      {/* Stock Warning */}
                      {item.availableStock && item.availableStock < 10 && (
                        <p className="text-xs text-orange-600">
                          Son {item.availableStock} ürün
                        </p>
                      )}

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="flex items-center text-red-600 hover:text-red-700 text-sm transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" /> 
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm sticky top-4 p-6">
          <h3 className="text-lg font-semibold mb-4">Sipariş Özeti</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Ürün Sayısı:</span>
              <span>{getTotalItems()} adet</span>
            </div>
            
            <div className="flex justify-between">
              <span>Ara Toplam:</span>
              <span>₺{formatPrice(getTotalPrice())}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Kargo:</span>
              <span className="text-green-600">Ücretsiz</span>
            </div>
            
            <hr className="my-4" />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Toplam:</span>
              <span className="text-blue-600">
                ₺{formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
              disabled={cartItems.length === 0}
            >
              Siparişi Tamamla
            </button>
            
            <button 
              onClick={handleBack}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Alışverişe Devam Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;