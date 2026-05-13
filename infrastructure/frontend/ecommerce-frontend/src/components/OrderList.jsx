import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ShoppingCart, Package, Eye, Search, Menu, X,
  MapPin, Clock, Wifi, WifiOff, XCircle, FileText, 
  Navigation, CreditCard, User, Phone, Mail, Home,
  Download, RefreshCw, MessageSquare, RotateCcw, AlertCircle
} from 'lucide-react';
import { getAuthToken, orderHelpers, cartHelpers } from '../services/api';
import { useOrderTracking } from '../hooks/useOrderTracking';
import TurkeyMap from './TurkeyMap';

const OrderList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orderId: orderIdFromPath } = useParams();
  const [userId, setUserId] = useState(null);
  const { orders: wsOrders, setOrders: setWsOrders, connected, latestUpdate } = useOrderTracking(userId);
  const [localOrders, setLocalOrders] = useState([]);
  const orders = wsOrders.length > 0 ? wsOrders : localOrders;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [errorRetryCount, setErrorRetryCount] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [reviewData, setReviewData] = useState({ productId: '', rating: 5, comment: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const [locationHistory, setLocationHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const orderStatuses = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'PENDING', label: 'Beklemede' },
    { value: 'CONFIRMED', label: 'Onaylandı' },
    { value: 'PREPARING', label: 'Hazırlanıyor' },
    { value: 'SHIPPED', label: 'Kargoda' },
    { value: 'DELIVERED', label: 'Teslim Edildi' },
    { value: 'CANCELLED', label: 'İptal Edildi' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-orange-100 text-orange-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const s = orderStatuses.find(st => st.value === status);
    return s ? s.label : status;
  };

  const fetchOrders = async (uid) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderHelpers.getUserOrders(uid);
      
      setLocalOrders(response.data);
      setWsOrders(response.data);
      
      setErrorRetryCount(0);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Siparişler yüklenemedi.');
      if (errorRetryCount < 3) {
        setTimeout(() => {
          setErrorRetryCount(prev => prev + 1);
          fetchOrders(uid);
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleOrder = async (orderId) => {
    try {
      setLoading(true);
      console.log('📦 Fetching single order:', orderId);
      const response = await orderHelpers.getOrderById(orderId);
      
      if (response.data) {
        console.log('✅ Single order fetched successfully');
        setSelectedOrder(response.data);
        setShowDetailModal(true);
        
        if (orderIdFromPath) {
          navigate('/orders', { replace: true });
        } else {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('orderId');
          const newUrl = `/orders${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
          navigate(newUrl, { replace: true });
        }
      }
    } catch (err) {
      console.error('❌ Single order fetch error:', err);
      toast.error('Sipariş detayları yüklenemedi: ' + (err.response?.data?.error || err.message));
      
      navigate('/orders', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationHistory = async (orderId) => {
    try {
      setLoadingHistory(true);
      const res = await orderHelpers.getLocationHistory(orderId);
      setLocationHistory(res.data.locationHistory || []);
    } catch (err) {
      console.error('Location history error:', err);
      toast.error('Konum geçmişi yüklenemedi.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDownloadInvoice = (order) => {
    toast.info('Fatura indiriliyor...', { autoClose: 2000 });
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Fatura - ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4F46E5; color: white; }
          .total { text-align: right; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FATURA</h1>
          <p>Sipariş No: ${order.id}</p>
          <p>Tarih: ${new Date(order.orderDate).toLocaleDateString('tr-TR')}</p>
        </div>
        <div class="info">
          <h3>Teslimat Bilgileri</h3>
          <p><strong>Alıcı:</strong> ${order.shippingAddress?.fullName || 'N/A'}</p>
          <p><strong>Adres:</strong> ${order.shippingAddress?.street}, ${order.shippingAddress?.city}</p>
          <p><strong>Telefon:</strong> ${order.shippingAddress?.phone || 'N/A'}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Birim Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map(item => `
              <tr>
                <td>${item.productName || 'Ürün'}</td>
                <td>${item.quantity}</td>
                <td>₺${item.price.toFixed(2)}</td>
                <td>₺${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Ara Toplam: ₺${order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
          <p>KDV (%18): ₺${(order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.18).toFixed(2)}</p>
          <p>Kargo: ₺29.90</p>
          <p style="color: #4F46E5;">TOPLAM: ₺${order.totalPrice?.toFixed(2)}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fatura-${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Fatura indirildi!');
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Lütfen iptal sebebini belirtin.');
      return;
    }

    try {
      setActionLoading(true);
      await orderHelpers.cancelOrder(selectedOrder.id, cancelReason);
      toast.success('Sipariş iptal edildi.');
      setCancelReason('');
      setShowCancelModal(false);
      fetchOrders(userId);
    } catch (err) {
      toast.error('İptal işlemi başarısız: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReorder = async (order) => {
    toast.info('Ürünler sepete ekleniyor...', { autoClose: 1500 });
    
    try {
      await cartHelpers.addItemsFromOrder(order.items);
      toast.success('Ürünler sepete eklendi!');
      setTimeout(() => navigate('/cart'), 1500);
    } catch (err) {
      toast.error('Sepete eklenirken hata oluştu: ' + (err.response?.data?.error || err.message));
    }
  };


  const handleReturnRequest = async () => {
    if (!returnReason.trim()) {
      toast.error('Lütfen iade sebebini belirtin.');
      return;
    }

    try {
      setActionLoading(true);
      await orderHelpers.createReturnRequest(selectedOrder.id, { 
        reason: returnReason,
        description: '' 
      });
      toast.success('İade talebiniz alındı. En kısa sürede değerlendirilecek.');
      setShowReturnModal(false);
      setReturnReason('');
    } catch (err) {
      toast.error('İade talebi gönderilemedi: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };


  const handleSubmitReview = async () => {
    if (!reviewData.productId || !reviewData.comment.trim()) {
      toast.error('Lütfen ürün seçin ve yorumunuzu yazın.');
      return;
    }

    try {
      setActionLoading(true);
      await orderHelpers.submitReview(selectedOrder.id, reviewData);
      toast.success('Yorumunuz kaydedildi. Teşekkürler!');
      setShowReviewModal(false);
      setReviewData({ productId: '', rating: 5, comment: '' });
    } catch (err) {
      toast.error('Yorum gönderilemedi: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleShowMap = async (order) => {
    setSelectedOrder(order);
    if (order.currentLocation) {
      await fetchLocationHistory(order.id);
      setShowMapModal(true);
    } else {
      toast.info('Bu sipariş için konum bilgisi yok.');
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
    setSelectedOrder(null);
    setLocationHistory([]);
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
      
      if (orderIdFromPath) {
        console.log('📦 Priority 1: Fetching order from PATH:', orderIdFromPath);
        fetchSingleOrder(orderIdFromPath);
        fetchOrders(user.id);
        return;
      }
      
      const orderIdFromQuery = searchParams.get('orderId');
      if (orderIdFromQuery) {
        console.log('📦 Priority 2: Fetching order from QUERY:', orderIdFromQuery);
        fetchSingleOrder(orderIdFromQuery);
        fetchOrders(user.id);
        return;
      }
      
      fetchOrders(user.id);
    }
  }, [orderIdFromPath]);

  useEffect(() => {
    if (orderIdFromPath && orders.length > 0 && !showDetailModal) {
      console.log('📦 Checking PATH orderId in loaded orders:', orderIdFromPath);
      
      const targetOrder = orders.find(o => o.id === orderIdFromPath);
      
      if (targetOrder) {
        console.log('✅ Found order in list, opening modal');
        setSelectedOrder(targetOrder);
        setShowDetailModal(true);
      }
      return;
    }
    
    const orderIdFromQuery = searchParams.get('orderId');
    
    if (orderIdFromQuery && orders.length > 0 && !showDetailModal) {
      console.log('📦 Checking QUERY orderId in loaded orders:', orderIdFromQuery);
      
      const targetOrder = orders.find(o => o.id === orderIdFromQuery);
      
      if (targetOrder) {
        console.log('✅ Found order in list, opening modal');
        setSelectedOrder(targetOrder);
        setShowDetailModal(true);
        
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('orderId');
        const newUrl = `/orders${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
        navigate(newUrl, { replace: true });
      }
    }
  }, [orders, searchParams, showDetailModal, orderIdFromPath]);

  useEffect(() => {
    if (showMapModal && selectedOrder?.id && selectedOrder?.currentLocation) {
      console.log('🗺️ Fetching history for modal');
      fetchLocationHistory(selectedOrder.id);
    }
  }, [showMapModal, selectedOrder?.id, selectedOrder?.currentLocation?.timestamp]);

  useEffect(() => {
    if (latestUpdate) {
      const { order } = latestUpdate;
      
      console.log('🔔 WebSocket update received:', order.id);
      
      toast.info(
        <div>
          <strong>Sipariş #{order.id.slice(-8)}</strong>
          <p>{getStatusLabel(order.status)}</p>
          {order.currentLocation?.address && (
            <p className="text-xs mt-1">📍 {order.currentLocation.address}</p>
          )}
        </div>,
        { position: 'top-right', autoClose: 4000 }
      );

      if (selectedOrder && selectedOrder.id === order.id) {
        console.log('🔄 Updating selected order');
        setSelectedOrder(order);
        
        if (showMapModal && order.currentLocation) {
          console.log('🗺️ Refreshing location history');
          fetchLocationHistory(order.id);
        }
      }
    }
  }, [latestUpdate, selectedOrder?.id, showMapModal]);

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      || order.items?.some(i => i.productName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = selectedStatus === '' || order.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const Navbar = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-7 w-7 text-white" />
            <span className="text-xl font-bold text-white">Siparişlerim</span>
            <div className="ml-4 flex items-center">
              {connected ? (
                <div className="flex items-center text-green-300 text-xs">
                  <Wifi className="h-4 w-4 mr-1" /> Canlı
                </div>
              ) : (
                <div className="flex items-center text-red-300 text-xs">
                  <WifiOff className="h-4 w-4 mr-1" /> Bağlantı Yok
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-white hover:text-blue-200">Ana Sayfa</a>
            <a href="/cart" className="text-white hover:text-blue-200">Sepetim</a>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-700 pb-4">
            <a href="/" className="block px-3 py-2 text-white hover:bg-blue-600 rounded">Ana Sayfa</a>
            <a href="/cart" className="block px-3 py-2 text-white hover:bg-blue-600 rounded">Sepetim</a>
          </div>
        )}
      </div>
    </nav>
  );

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mt-2">#{order.id?.slice(-8)}</h3>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          ₺{order.totalPrice?.toLocaleString('tr-TR')}
        </p>
      </div>
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <Clock className="h-4 w-4 mr-2" />
        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('tr-TR') : 'Tarih yok'}
      </div>
      {order.shippingAddress && (
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          {order.shippingAddress.city}, {order.shippingAddress.street?.substring(0, 30)}...
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => handleShowDetail(order)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex justify-center items-center space-x-2 transition-colors text-sm"
        >
          <FileText className="h-4 w-4" /> <span>Detaylar</span>
        </button>
        <button
          onClick={() => handleShowMap(order)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex justify-center items-center space-x-2 transition-colors text-sm"
        >
          <Navigation className="h-4 w-4" /> <span>Harita</span>
        </button>
      </div>
    </div>
  );

  const DetailModal = () => {
    if (!showDetailModal || !selectedOrder) return null;

    const calculateSubtotal = () => {
      return selectedOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    };

    const calculateTax = () => {
      return calculateSubtotal() * 0.18;
    };

    const shippingCost = 29.90;

    const canCancel = selectedOrder.status === 'PENDING' || selectedOrder.status === 'CONFIRMED';
    const canReturn = selectedOrder.status === 'DELIVERED';
    const canReview = selectedOrder.status === 'DELIVERED';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-4xl my-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-white">Sipariş Detayı</h2>
              <p className="text-indigo-100 mt-1">Sipariş No: #{selectedOrder.id?.slice(-8)}</p>
            </div>
            <button onClick={handleCloseDetailModal} className="text-white hover:text-indigo-200 transition-colors">
              <XCircle className="h-8 w-8" />
            </button>
          </div>

          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sipariş Durumu</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Sipariş Tarihi</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(selectedOrder.orderDate).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-indigo-600" />
                Sipariş Ürünleri
              </h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName || 'Ürün Adı'}</p>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</p>
                      <p className="text-xs text-gray-500">Birim: ₺{item.price.toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                Fatura Özeti
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Ara Toplam</span>
                  <span>₺{calculateSubtotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>KDV (%18)</span>
                  <span>₺{calculateTax().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Kargo Ücreti</span>
                  <span>₺{shippingCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span className="text-indigo-600">
                      ₺{(calculateSubtotal() + calculateTax() + shippingCost).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2 text-indigo-600" />
                Teslimat Bilgileri
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {selectedOrder.shippingAddress?.fullName && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Alıcı</p>
                      <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                    </div>
                  </div>
                )}
                {selectedOrder.shippingAddress?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Telefon</p>
                      <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Adres</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.shippingAddress?.street}<br />
                      {selectedOrder.shippingAddress?.district && `${selectedOrder.shippingAddress.district}, `}
                      {selectedOrder.shippingAddress?.city} {selectedOrder.shippingAddress?.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm font-medium text-yellow-800 mb-1">Notlar</p>
                <p className="text-sm text-yellow-700">{selectedOrder.notes}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDownloadInvoice(selectedOrder)}
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="h-5 w-5" />
                Fatura İndir
              </button>
              <button
                onClick={() => {
                  handleCloseDetailModal();
                  handleShowMap(selectedOrder);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="h-5 w-5" />
                Haritada Gör
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleReorder(selectedOrder)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Tekrar Al
              </button>
              
              {canReview && (
                <button
                  onClick={() => {
                    handleCloseDetailModal();
                    setShowReviewModal(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Yorum Yap
                </button>
              )}
              
              {canReturn && (
                <button
                  onClick={() => {
                    handleCloseDetailModal();
                    setShowReturnModal(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  İade Et
                </button>
              )}
              
              {canCancel && (
                <button
                  onClick={() => {
                    handleCloseDetailModal();
                    setShowCancelModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <XCircle className="h-4 w-4" />
                  İptal Et
                </button>
              )}
            </div>
            
            <button
              onClick={handleCloseDetailModal}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CancelModal = () => {
    if (!showCancelModal || !selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Siparişi İptal Et</h3>
                <p className="text-sm text-gray-600">Sipariş #{selectedOrder.id?.slice(-8)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İptal Sebebi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Lütfen iptal sebebinizi belirtin..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows="4"
            />
            <p className="text-xs text-gray-500 mt-2">
              İptal edilen siparişler geri alınamaz. Ödeme yapılmışsa iade işlemi başlatılacaktır.
            </p>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setCancelReason('');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={actionLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {actionLoading ? 'İptal Ediliyor...' : 'İptal Et'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReturnModal = () => {
    if (!showReturnModal || !selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <RotateCcw className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">İade Talebi</h3>
                <p className="text-sm text-gray-600">Sipariş #{selectedOrder.id?.slice(-8)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İade Sebebi <span className="text-red-500">*</span>
            </label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3"
            >
              <option value="">Seçiniz...</option>
              <option value="damaged">Ürün hasarlı/kırık</option>
              <option value="wrong">Yanlış ürün gönderildi</option>
              <option value="defective">Ürün çalışmıyor</option>
              <option value="notExpected">Beklediğim gibi değil</option>
              <option value="other">Diğer</option>
            </select>
            
            <textarea
              placeholder="Detaylı açıklama (isteğe bağlı)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
            />
            
            <p className="text-xs text-gray-500 mt-2">
              İade talebiniz 24 saat içinde değerlendirilecektir. Ürünü kargo ile göndermeniz gerekebilir.
            </p>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => {
                setShowReturnModal(false);
                setReturnReason('');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={handleReturnRequest}
              disabled={actionLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {actionLoading ? 'Gönderiliyor...' : 'Talep Oluştur'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReviewModal = () => {
    if (!showReviewModal || !selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Ürün Yorumu</h3>
                <p className="text-sm text-gray-600">Deneyiminizi paylaşın</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Seçin <span className="text-red-500">*</span>
              </label>
              <select
                value={reviewData.productId}
                onChange={(e) => setReviewData({ ...reviewData, productId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Ürün seçiniz...</option>
                {selectedOrder.items?.map((item, index) => (
                  <option key={index} value={item.productId}>
                    {item.productName || 'Ürün ' + (index + 1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Değerlendirme
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="text-3xl transition-colors"
                  >
                    {star <= reviewData.rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yorumunuz <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Ürün hakkındaki düşüncelerinizi yazın..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                rows="4"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => {
                setShowReviewModal(false);
                setReviewData({ productId: '', rating: 5, comment: '' });
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={actionLoading}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {actionLoading ? 'Gönderiliyor...' : 'Yorum Yap'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MapModal = () => {
    if (!showMapModal || !selectedOrder) return null;

    const warehouseLocation = {
      latitude: 41.0082,
      longitude: 28.9784,
      address: "Depo - İstanbul"
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Sipariş #{selectedOrder.id?.slice(-8)}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </p>
            </div>
            <button onClick={handleCloseMapModal} className="text-gray-500 hover:text-gray-700 transition-colors">
              <XCircle className="h-8 w-8" />
            </button>
          </div>

          <div className="flex-1 relative">
            {loadingHistory ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Konum bilgileri yükleniyor...</p>
                </div>
              </div>
            ) : (
              <TurkeyMap
                key={selectedOrder.currentLocation?.timestamp || Date.now()}
                currentLocation={selectedOrder.currentLocation}
                destination={selectedOrder.shippingAddress ? {
                  latitude: selectedOrder.shippingAddress.latitude || 39.9334,
                  longitude: selectedOrder.shippingAddress.longitude || 32.8597,
                  address: `${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.street}`
                } : null}
                locationHistory={locationHistory}
                warehouseLocation={warehouseLocation}
              />
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Teslimat Adresi</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.street}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Sipariş Tarihi</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedOrder.orderDate).toLocaleString('tr-TR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Toplam Tutar</p>
                <p className="text-sm font-bold text-blue-600">
                  ₺{selectedOrder.totalPrice?.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
            
            {selectedOrder.currentLocation && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Son Konum:</span>
                  </div>
                  <span className="text-xs text-blue-600">
                    {selectedOrder.currentLocation.timestamp 
                      ? new Date(selectedOrder.currentLocation.timestamp).toLocaleTimeString('tr-TR')
                      : 'Şimdi'}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {selectedOrder.currentLocation.address || 'Adres bilgisi yok'}
                </p>
                {selectedOrder.currentLocation.description && (
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedOrder.currentLocation.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sipariş ID veya ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {orderStatuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
            <button onClick={() => fetchOrders(userId)} className="ml-2 text-red-600 underline">
              Tekrar Dene
            </button>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz yok</h3>
            <p className="text-gray-600 mb-4">Alışverişe başlayın ve ilk siparişinizi verin!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Alışverişe Başla
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <DetailModal />
      <MapModal />
      <CancelModal />
      <ReturnModal />
      <ReviewModal />
    </div>
  );
};

export default OrderList;