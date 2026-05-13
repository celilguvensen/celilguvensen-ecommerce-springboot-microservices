import React, { useState, useEffect } from 'react';
import { ChevronLeft, ShoppingCart, MapPin, CreditCard, CheckCircle, Package } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';
import { cartAPI, orderAPI } from '../services/api';

const CheckoutFlow = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [addressData, setAddressData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, name: 'Sepet', icon: ShoppingCart },
    { id: 2, name: 'Adres', icon: MapPin },
    { id: 3, name: 'Özet', icon: CreditCard },
    { id: 4, name: 'Tamamlandı', icon: CheckCircle }
  ];

  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 4) navigate('/');
  }, [cartItems, navigate, currentStep]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  const getImageUrl = (item) => {
    const imagePath = item.productImage || item.imageUrl || (item.imageUrls && item.imageUrls[0]) || null;
    
    console.log('CheckoutFlow - getImageUrl:', {
      productName: item.name || item.productName,
      productImage: item.productImage,
      imageUrl: item.imageUrl,
      imageUrls: item.imageUrls,
      finalPath: imagePath
    });

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

  const proceedToAddress = () => setCurrentStep(2);
  const proceedToSummary = (address) => {
    setAddressData(address);
    setCurrentStep(3);
  };

  const completeOrder = async (paymentMethod = 'CREDIT_CARD') => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = currentUser?.id || `anonymous_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const orderItems = cartItems.map(item => ({
        productId: item.id || item.productId,
        productName: item.name || item.productName,
        price: Number(item.price),
        quantity: Number(item.quantity),
        imageUrl: item.productImage || item.imageUrl || (item.imageUrls && item.imageUrls[0])
      }));

      const orderPayload = {
        userId,
        order: {
          items: orderItems,
          shippingAddress: addressData,
          totalPrice: getTotalPrice(),
          status: 'PENDING',
          orderDate: new Date().toISOString(),
          paymentMethod,
          notes: addressData.description || ''
        }
      };

      const response = await orderAPI.post("/checkout", orderPayload);
      const order = response.data;
      setOrderData(order);

      if (currentUser && currentUser.role !== "ANONYMOUS") {
        try {
          await cartAPI.delete('');
          console.log("Cart cleared in backend");
        } catch (err) {
          console.warn("Backend cart clear failed:", err);
        }
      } else {
        console.log("Guest user → sadece frontend clear çalışacak");
      }

      clearCart();
      setCurrentStep(4);

    } catch (err) {
      alert(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/cart');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${currentStep >= step.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.name}
                </span>
                {step.id < steps.length && <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          {currentStep > 1 && currentStep < 4 && (
            <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
              <ChevronLeft className="w-5 h-5 mr-1" /> Geri
            </button>
          )}

          {currentStep === 1 && <CartReview items={cartItems} total={getTotalPrice()} onProceed={proceedToAddress} getImageUrl={getImageUrl} />}
          {currentStep === 2 && <AddressForm onSubmit={proceedToSummary} />}
          {currentStep === 3 && <OrderSummary items={cartItems} address={addressData} total={getTotalPrice()} onComplete={completeOrder} loading={loading} getImageUrl={getImageUrl} />}
          {currentStep === 4 && <OrderComplete order={orderData} navigate={navigate} />}
        </div>
      </div>
    </div>
  );
};

const CartReview = ({ items, total, onProceed, getImageUrl }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">Sepetim</h2>
    {items.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4" />
        Sepetiniz boş
      </div>
    ) : (
      <>
        <div className="space-y-4 mb-6">
          {items.map((item, index) => {
            const imageUrl = getImageUrl(item);
            const itemName = item.name || item.productName || 'Ürün';
            
            console.log('CartReview item:', {
              name: itemName,
              imageUrl,
              item
            });

            return (
              <div key={item.id || item.productId || index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center overflow-hidden relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={itemName}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('CartReview image error:', imageUrl);
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.fallback-icon');
                          if (fallback) fallback.style.display = 'block';
                        }}
                        onLoad={() => {
                          console.log('CartReview image loaded:', imageUrl);
                        }}
                      />
                    ) : null}
                    <Package 
                      className="fallback-icon w-8 h-8 text-gray-400 absolute" 
                      style={{display: imageUrl ? 'none' : 'block'}}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{itemName}</h3>
                    <p className="text-gray-600">Adet: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</p>
                  <p className="text-sm text-gray-600">₺{item.price.toLocaleString('tr-TR')} / adet</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-4 mb-6 flex justify-between text-xl font-semibold">
          <span>Toplam:</span>
          <span>₺{total.toLocaleString('tr-TR')}</span>
        </div>
        <button onClick={onProceed} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
          Devam Et
        </button>
      </>
    )}
  </div>
);

const OrderSummary = ({ items, address, total, onComplete, loading, getImageUrl }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">Sipariş Özeti</h2>
    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
      <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
      <p className="text-sm">
        {address.fullName}<br />
        {address.street}<br />
        {address.district}, {address.city} {address.postalCode}
        {address.description && <><br />Not: {address.description}</>}
      </p>
    </div>
    <div className="mb-6">
      <h3 className="font-semibold mb-4">Ürünler</h3>
      {items.map((item, index) => {
        const imageUrl = getImageUrl(item);
        const itemName = item.name || item.productName || 'Ürün';
        
        console.log('OrderSummary item:', {
          name: itemName,
          imageUrl,
          item
        });

        return (
          <div key={item.id || item.productId || index} className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden relative flex items-center justify-center">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={itemName} 
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      console.error('OrderSummary image error:', imageUrl);
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.fallback-icon');
                      if (fallback) fallback.style.display = 'block';
                    }}
                    onLoad={() => {
                      console.log('OrderSummary image loaded:', imageUrl);
                    }}
                  />
                ) : null}
                <Package 
                  className="fallback-icon w-8 h-8 text-gray-400 absolute" 
                  style={{display: imageUrl ? 'none' : 'block'}}
                />
              </div>
              <span>{itemName} x {item.quantity}</span>
            </div>
            <span>₺{(item.price * item.quantity).toLocaleString('tr-TR')}</span>
          </div>
        );
      })}
    </div>
    <div className="border-t pt-4 mb-6 flex justify-between text-xl font-semibold">
      <span>Toplam:</span>
      <span>₺{total.toLocaleString('tr-TR')}</span>
    </div>
    <button onClick={() => onComplete('CREDIT_CARD')} disabled={loading} className={`w-full py-3 rounded-xl text-white font-semibold transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
      {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Onayla ve Tamamla'}
    </button>
  </div>
);

const OrderComplete = ({ order, navigate }) => (
  <div className="text-center py-8">
    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
    <h2 className="text-2xl font-semibold text-green-600 mb-4">Siparişiniz Tamamlandı!</h2>
    {order && (
      <div className="bg-green-50 rounded-xl p-6 mb-6">
        <p className="text-lg font-semibold mb-2">Sipariş Numarası</p>
        <p className="text-2xl font-bold text-green-600">{order.id}</p>
        <p className="mt-2 text-sm text-gray-600">Tahmini teslimat: 2-3 iş günü</p>
      </div>
    )}
    <div className="space-y-3">
      <button 
        onClick={() => navigate(`/orders/${order.id}`)} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
      >
        Siparişimi Takip Et
      </button>
      <button 
        onClick={() => navigate('/')} 
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold"
      >
        Alışverişe Devam Et
      </button>
    </div>
  </div>
);

export default CheckoutFlow;