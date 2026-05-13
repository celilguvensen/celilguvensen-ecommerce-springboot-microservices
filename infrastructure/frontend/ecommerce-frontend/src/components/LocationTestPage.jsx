import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Navigation, MapPin, Send, RefreshCw, Map as MapIcon,
  Package, Clock, User, ChevronDown, ChevronUp
} from 'lucide-react';
import { getAuthToken, orderHelpers } from '../services/api';
import { useNavigate } from 'react-router-dom';

const LocationTestPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    address: '',
    description: ''
  });

  const cityCoordinates = {
    'İstanbul': { lat: 41.0082, lng: 28.9784, desc: 'İstanbul Merkez' },
    'Ankara': { lat: 39.9334, lng: 32.8597, desc: 'Ankara Merkez' },
    'İzmir': { lat: 38.4237, lng: 27.1428, desc: 'İzmir Merkez' },
    'Antalya': { lat: 36.8969, lng: 30.7133, desc: 'Antalya Merkez' },
    'Bursa': { lat: 40.1828, lng: 29.0665, desc: 'Bursa Merkez' },
    'Adana': { lat: 37.0000, lng: 35.3213, desc: 'Adana Merkez' },
    'Konya': { lat: 37.8667, lng: 32.4833, desc: 'Konya Merkez' },
    'Eskişehir': { lat: 39.7767, lng: 30.5206, desc: 'Eskişehir Merkez' },
    'Kocaeli': { lat: 40.8533, lng: 29.8815, desc: 'Kocaeli Merkez' },
    'Diyarbakır': { lat: 38.2700, lng: 39.7620, desc: 'Diyarbakır' },
    'Trabzon': { lat: 41.0015, lng: 39.7178, desc: 'Trabzon Merkez' }
  };

  const simulationRoutes = {
    'İstanbul → Ankara': [
      { lat: 41.0082, lng: 28.9784, desc: 'Depo - İstanbul' },
      { lat: 40.7661, lng: 30.4028, desc: 'Sapanca - Geçiş' },
      { lat: 40.6500, lng: 31.1656, desc: 'Düzce' },
      { lat: 40.4500, lng: 31.7833, desc: 'Bolu' },
      { lat: 40.0500, lng: 32.5000, desc: 'Ankara Yaklaşım' },
      { lat: 39.9334, lng: 32.8597, desc: 'Ankara - Teslimat' }
    ],
    'İstanbul → İzmir': [
      { lat: 41.0082, lng: 28.9784, desc: 'Depo - İstanbul' },
      { lat: 40.1828, lng: 29.0665, desc: 'Bursa' },
      { lat: 39.6191, lng: 27.8871, desc: 'Balıkesir' },
      { lat: 38.7507, lng: 27.5567, desc: 'Manisa' },
      { lat: 38.4237, lng: 27.1428, desc: 'İzmir - Teslimat' }
    ],
    'İstanbul → Antalya': [
      { lat: 41.0082, lng: 28.9784, desc: 'Depo - İstanbul' },
      { lat: 40.1828, lng: 29.0665, desc: 'Bursa' },
      { lat: 38.6191, lng: 29.0869, desc: 'Afyon' },
      { lat: 37.8667, lng: 30.5369, desc: 'Isparta' },
      { lat: 36.8969, lng: 30.7133, desc: 'Antalya - Teslimat' }
    ]
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/auth');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      setUserId(user.id);
      fetchOrders(user.id);
    }
  }, []);

  const fetchOrders = async (uid) => {
    try {
      setLoading(true);
      const response = await orderHelpers.getUserOrders(uid);
      const activeOrders = response.data.filter(
        order => order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
      );
      setOrders(activeOrders);
      if (activeOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(activeOrders[0]);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      toast.error('Siparişler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (cityName) => {
    const coords = cityCoordinates[cityName];
    setLocationData({
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
      address: cityName,
      description: coords.desc
    });
    toast.info(`${cityName} koordinatları yüklendi`);
  };

  const handleSelectRoute = (routeName) => {
    const route = simulationRoutes[routeName];
    if (!route || route.length === 0) return;

    toast.info(`${routeName} rotası başlatılıyor...`);
    
    route.forEach((point, index) => {
      setTimeout(() => {
        setLocationData({
          latitude: point.lat.toString(),
          longitude: point.lng.toString(),
          address: point.desc.split(' - ')[0],
          description: point.desc
        });
        
        if (index < route.length - 1) {
          setTimeout(() => {
            handleUpdateLocation(point);
          }, 500);
        }
      }, index * 3000); 
    });
  };

  const handleUpdateLocation = async (customData = null) => {
    if (!selectedOrder) {
      toast.error('Lütfen bir sipariş seçin');
      return;
    }

    const data = customData || locationData;

    if (!data.latitude || !data.longitude) {
      toast.error('Lütfen enlem ve boylam girin');
      return;
    }

    try {
      setSending(true);
      
      await orderHelpers.updateLocation(selectedOrder.id, {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        address: data.address || 'Belirtilmemiş',
        description: data.description || ''
      });

      toast.success('Konum güncellendi! 📍', {
        position: 'top-right',
        autoClose: 2000
      });

      fetchOrders(userId);

    } catch (err) {
      console.error('Location update error:', err);
      toast.error('Konum güncellenemedi: ' + (err.response?.data?.error || err.message));
    } finally {
      setSending(false);
    }
  };

  const getRandomNearbyCoords = () => {
    if (!selectedOrder?.currentLocation) {
      toast.warning('Mevcut konum bulunamadı');
      return;
    }

    const current = selectedOrder.currentLocation;
    const offsetLat = (Math.random() - 0.5) * 0.1; 
    const offsetLng = (Math.random() - 0.5) * 0.1;

    setLocationData({
      latitude: (current.latitude + offsetLat).toFixed(6),
      longitude: (current.longitude + offsetLng).toFixed(6),
      address: current.address || '',
      description: 'Rastgele yakın konum'
    });

    toast.info('Yakın rastgele konum oluşturuldu');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING': 'Beklemede',
      'CONFIRMED': 'Onaylandı',
      'PREPARING': 'Hazırlanıyor',
      'SHIPPED': 'Kargoda'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Navigation className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Konum Test Paneli</h1>
                <p className="text-blue-100 text-sm">Sipariş konumlarını manuel olarak güncelleyin</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
            >
              Siparişlerime Dön
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sol Panel - Sipariş Listesi */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Aktif Siparişler
                </h2>
                <button
                  onClick={() => fetchOrders(userId)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aktif sipariş bulunamadı</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div key={order.id}>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setExpandedOrder(expandedOrder === order.id ? null : order.id);
                        }}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedOrder?.id === order.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">
                            #{order.id?.slice(-8)}
                          </span>
                          {expandedOrder === order.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </button>

                      {expandedOrder === order.id && (
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">Mevcut Konum:</span>
                            </div>
                            {order.currentLocation ? (
                              <div className="pl-6 text-gray-600">
                                <p>{order.currentLocation.address || 'Adres yok'}</p>
                                <p className="text-xs text-gray-500">
                                  {order.currentLocation.latitude?.toFixed(4)}, {order.currentLocation.longitude?.toFixed(4)}
                                </p>
                              </div>
                            ) : (
                              <p className="pl-6 text-gray-500">Henüz konum bilgisi yok</p>
                            )}
                            
                            <div className="flex items-center gap-2 text-gray-700 mt-3">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">Hedef:</span>
                            </div>
                            <div className="pl-6 text-gray-600">
                              <p>{order.shippingAddress?.city}, {order.shippingAddress?.street?.substring(0, 40)}...</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Panel - Konum Güncelleme */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Hızlı Şehir Seçimi */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-blue-600" />
                Hızlı Konum Seçimi
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir Seç
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.keys(cityCoordinates).map((city) => (
                      <button
                        key={city}
                        onClick={() => handleSelectCity(city)}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Simülasyon Rotası
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.keys(simulationRoutes).map((route) => (
                      <button
                        key={route}
                        onClick={() => handleSelectRoute(route)}
                        className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        {route}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={getRandomNearbyCoords}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  🎲 Rastgele Yakın Konum
                </button>
              </div>
            </div>

            {/* Manuel Konum Girişi */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                Manuel Konum Güncelleme
              </h3>

              {!selectedOrder ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p>Lütfen soldaki listeden bir sipariş seçin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enlem (Latitude) *
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={locationData.latitude}
                        onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                        placeholder="41.0082"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Boylam (Longitude) *
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={locationData.longitude}
                        onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                        placeholder="28.9784"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres
                    </label>
                    <input
                      type="text"
                      value={locationData.address}
                      onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                      placeholder="İstanbul, Türkiye"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={locationData.description}
                      onChange={(e) => setLocationData({ ...locationData, description: e.target.value })}
                      placeholder="Örn: Kargo merkezi, Transit geçiş, vb."
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    onClick={() => handleUpdateLocation()}
                    disabled={sending || !locationData.latitude || !locationData.longitude}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Konumu Güncelle
                      </>
                    )}
                  </button>

                  {selectedOrder.currentLocation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">Mevcut Konum:</p>
                      <p className="text-sm text-blue-700">
                        {selectedOrder.currentLocation.address || 'Adres yok'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        📍 {selectedOrder.currentLocation.latitude?.toFixed(6)}, {selectedOrder.currentLocation.longitude?.toFixed(6)}
                      </p>
                      {selectedOrder.currentLocation.description && (
                        <p className="text-xs text-blue-600 mt-1">
                          {selectedOrder.currentLocation.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bilgi Kutusu */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-1">Test Modu</h4>
                  <p className="text-sm text-amber-800">
                    Bu sayfa konum güncellemelerini test etmek içindir. Gerçek kargolarda bu işlemi kurye uygulaması otomatik yapar.
                  </p>
                  <p className="text-xs text-amber-700 mt-2">
                    💡 Simülasyon rotaları kullanarak otomatik konum güncellemesi yapabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTestPage;