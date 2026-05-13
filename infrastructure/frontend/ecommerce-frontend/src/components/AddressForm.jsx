import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import { useAuth } from './AuthContext';
import { orderAPI } from '../services/api';

const AddressForm = ({ onSubmit }) => {
  const { user, isAuthenticated } = useAuth();
  const [mode, setMode] = useState('select');  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  
 
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    district: '',
    city: '',
    postalCode: '',
    description: ''
  });

   
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadSavedAddresses();
    } else {
       
      setMode('new');
    }
  }, [isAuthenticated, user]);

  const loadSavedAddresses = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.get(`/user/${user.id}`);
      const orders = response.data;

      const addresses = [];
      const addressMap = new Map();

      orders.forEach(order => {
        if (order.shippingAddress) {
          const key = JSON.stringify(order.shippingAddress);
          if (!addressMap.has(key)) {
            addressMap.set(key, {
              ...order.shippingAddress,
              orderId: order.id,
              orderDate: order.orderDate
            });
            addresses.push(addressMap.get(key));
          }
        }
      });

      setSavedAddresses(addresses);
      
      if (addresses.length > 0) {
        setMode('select');
      } else {
        setMode('new');
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
      setMode('new'); 
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleSubmitSelectedAddress = () => {
    if (selectedAddress) {
      const { orderId, orderDate, ...addressData } = selectedAddress;
      onSubmit(addressData);
    }
  };

  const handleSubmitNewAddress = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Adresler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Teslimat Adresi</h2>

      {/* Mode Selector - Sadece login kullanıcı için */}
      {isAuthenticated && savedAddresses.length > 0 && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('select')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              mode === 'select'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-5 h-5 inline mr-2" />
            Kayıtlı Adreslerim ({savedAddresses.length})
          </button>
          <button
            onClick={() => {
              setMode('new');
              setSelectedAddress(null);
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              mode === 'new'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Yeni Adres Ekle
          </button>
        </div>
      )}

      {/* Kayıtlı Adresler Listesi */}
      {mode === 'select' && savedAddresses.length > 0 && (
        <div>
          <div className="space-y-3 mb-6">
            {savedAddresses.map((address, index) => (
              <div
                key={index}
                onClick={() => handleSelectAddress(address)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAddress === address
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{address.fullName}</h3>
                      {selectedAddress === address && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {address.street}, {address.district}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city} {address.postalCode}
                    </p>
                    {address.description && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Not: {address.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmitSelectedAddress}
            disabled={!selectedAddress}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              selectedAddress
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Bu Adresi Kullan
          </button>
        </div>
      )}

      {/* Yeni Adres Formu */}
      {mode === 'new' && (
        <form onSubmit={handleSubmitNewAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="fullName"
              placeholder="Ad Soyad *"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="phone"
              placeholder="Telefon *"
              value={formData.phone}
              onChange={handleChange}
              required
              className="col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            name="street"
            placeholder="Adres (Cadde, Sokak, No) *"
            value={formData.street}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="district"
              placeholder="İlçe *"
              value={formData.district}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="city"
              placeholder="İl *"
              value={formData.city}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            name="postalCode"
            placeholder="Posta Kodu"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            placeholder="Adres Tarifi (Opsiyonel)"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Devam Et
          </button>
        </form>
      )}
    </div>
  );
};

export default AddressForm;