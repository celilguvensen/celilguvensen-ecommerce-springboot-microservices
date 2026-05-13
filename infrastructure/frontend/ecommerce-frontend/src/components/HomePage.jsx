import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Monitor, Smartphone, Home, Wind, Lightbulb, Car,
  TrendingUp, Shield, Truck, CreditCard, ChevronRight,
  Zap, Star, Award, Package, Eye
} from 'lucide-react';
import { productAPI } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.get('');
        const products = response.data?.products || response.data || [];
        setFeaturedProducts(products.slice(0, 8));
      } catch (error) {
        console.error('Featured products error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const banners = [
    {
      title: "Yeni Sezon Ürünler",
      subtitle: "En yeni teknolojiler şimdi burada",
      bg: "from-blue-600 to-purple-600",
      image: "🚀"
    },
    {
      title: "Büyük İndirim Kampanyası",
      subtitle: "%50'ye varan indirimler",
      bg: "from-red-600 to-orange-600",
      image: "🔥"
    },
    {
      title: "Ücretsiz Kargo",
      subtitle: "Tüm siparişlerde ücretsiz teslimat",
      bg: "from-green-600 to-teal-600",
      image: "📦"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = [
    { name: 'Elektronik', icon: Monitor, color: 'bg-blue-500', link: '/main-category/Elektronik' },
    { name: 'Beyaz Eşya', icon: Home, color: 'bg-green-500', link: '/main-category/Beyaz Eşya' },
    { name: 'Telefon', icon: Smartphone, color: 'bg-purple-500', link: '/category/Telefon' },
    { name: 'İklim', icon: Wind, color: 'bg-cyan-500', link: '/main-category/İklimlendirme' },
    { name: 'Akıllı Ev', icon: Lightbulb, color: 'bg-yellow-500', link: '/main-category/Akilli Ürünler' },
    { name: 'Mobilite', icon: Car, color: 'bg-red-500', link: '/main-category/Mobilite' }
  ];

  const features = [
    { icon: Truck, title: 'Ücretsiz Kargo', desc: 'Tüm siparişlerde' },
    { icon: Shield, title: 'Güvenli Ödeme', desc: '256-bit SSL' },
    { icon: CreditCard, title: 'Kolay İade', desc: '14 gün içinde' },
    { icon: Zap, title: 'Hızlı Teslimat', desc: 'Aynı gün kargo' }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative h-[380px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-6 shadow-xl">
        {banners.map((banner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBanner === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${banner.bg}`}
            style={{ pointerEvents: currentBanner === index ? 'auto' : 'none' }}
          >
            <div className="max-w-7xl mx-auto px-8 h-full flex items-center">
              <div className="text-white max-w-xl">
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl mb-2"
                >
                  {banner.image}
                </motion.div>
                <motion.h1
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
                >
                  {banner.title}
                </motion.h1>
                <motion.p
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg mb-6 text-white/90"
                >
                  {banner.subtitle}
                </motion.p>
                <motion.button
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm md:text-base flex items-center gap-2 hover:shadow-lg transition-all"
                  onClick={() => navigate('/urunler')}
                >
                  Keşfet <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-1.5 rounded-full transition-all ${
                currentBanner === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Popüler Kategoriler
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              onClick={() => navigate(cat.link)}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer group border border-white/20"
            >
              <div className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform mx-auto shadow-sm`}>
                <cat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white">Öne Çıkanlar</h2>
          <button
            onClick={() => navigate('/urunler')}
            className="text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors"
          >
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer flex flex-col h-full"
                onClick={() => navigate(`/${product.name?.toLowerCase().replace(/\s+/g, '-')}-${product.id}`)}
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {product.imageUrls?.[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                    {product.category || 'Elektronik'}
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-1">
                    {product.name || 'Ürün Adı'}
                  </h3>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ₺{(product.price || 0).toLocaleString('tr-TR')}
                    </span>
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/95 rounded-2xl p-6 mb-10 shadow-lg">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-1">{feature.title}</h3>
              <p className="text-gray-500 text-[11px]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-lg group"
          onClick={() => navigate('/urunler')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 to-red-600/90 flex items-center justify-center p-6">
            <div className="text-white text-center">
              <Award className="w-10 h-10 mx-auto mb-2" />
              <h3 className="text-2xl font-bold mb-1">Özel İndirim</h3>
              <p className="text-sm opacity-90 font-medium">Seçili ürünlerde %40 indirim</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-lg group"
          onClick={() => navigate('/urunler')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-teal-600/90 flex items-center justify-center p-6">
            <div className="text-white text-center">
              <Star className="w-10 h-10 mx-auto mb-2" />
              <h3 className="text-2xl font-bold mb-1">Yeni Gelenler</h3>
              <p className="text-sm opacity-90 font-medium">Son teknoloji koleksiyonu</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center text-white mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <TrendingUp className="w-10 h-10 mx-auto mb-4 text-blue-300" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Geleceği Bugün Yaşayın
          </h2>
          <p className="text-sm md:text-base mb-6 text-white/70 max-w-md mx-auto">
            En akıllı cihazlarla hayatınızı kolaylaştırın. Binlerce seçenek sizi bekliyor.
          </p>
          <button
            onClick={() => navigate('/urunler')}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            Alışverişe Başla <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;