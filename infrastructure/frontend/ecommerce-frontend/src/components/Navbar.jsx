import { useState } from 'react';
import { Package, ShoppingCart, Plus, Minus, X, Menu, CircleUser } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HTechLogo from "./HTechLogo";

const mainCategories = [
  {
    name: 'Elektronik',
    subCategories: ['TV', 'Bilgisayar', 'Ses Sistemleri'],
  },
  {
    name: 'Beyaz Eşya',
    subCategories: ['Buzdolabı', 'Çamaşır Makinesi', 'Bulaşık Makinesi', 'Kurutma Makinesi'],
  },
  {
    name: 'Ankastre',
    subCategories: ['Fırın', 'Ocak', 'Davlumbaz'],
  },
  {
    name: 'Ev Aletleri',
    subCategories: ['Süpürge', 'Blender', 'Mikser'],
  },
  {
    name: 'İklimlendirme',
    subCategories: ['Klima', 'Vantilatör', 'Isıtıcı'],
  },
  {
    name: 'Akilli Ürünler',
    subCategories: ['Akıllı Saat', 'Smart TV', 'Akıllı Lamba'],
  },
  {
    name: 'Mobilite',
    subCategories: ['Elektrikli Scooter', 'Hoverboard'],
  },
  {
    name: 'Diğer Ürünler',
    subCategories: ['Aksesuar', 'Kablo', 'Batarya'],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isLoggedIn = user && !user.isGuest;

  const handleCartView = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  const handleUserMenuClick = (path) => {
    setIsUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleMainCategoryClick = (categoryName) => {
    setHoveredCategory(null);
    navigate(`/main-category/${encodeURIComponent(categoryName)}`);
  };

  const handleSubCategoryClick = (categoryName) => {
    setHoveredCategory(null);
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost';
    if (imagePath.startsWith('/')) return `${baseUrl}${imagePath}`;
    return `${baseUrl}/${imagePath}`;
  };

  const getFirstValidImage = (item) => {
    if (item.productImage) {
      const url = getImageUrl(item.productImage);
      if (url) return url;
    }
    if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
      for (let imageUrl of item.imageUrls) {
        const url = getImageUrl(imageUrl);
        if (url) return url;
      }
    }
    if (item.imageUrl) {
      const url = getImageUrl(item.imageUrl);
      if (url) return url;
    }
    return null;
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleImageError = (e, imageUrl, item) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Image load error:', { imageUrl, itemId: item.productId, itemName: item.productName });
    }
    e.target.style.display = 'none';
    const iconElement = e.target.parentElement.querySelector('.fallback-icon');
    if (iconElement) iconElement.style.display = 'block';
  };

  const handleImageLoad = (e) => {
    const iconElement = e.target.parentElement.querySelector('.fallback-icon');
    if (iconElement) iconElement.style.display = 'none';
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg bg-white">
      <div className="bg-gradient-to-r from-red-600 to-blue-800 min-h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center">
            <HTechLogo />
            <a href='/'><span className="text-xl font-bold text-white"></span></a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="text-white hover:text-blue-200 px-4 py-2 rounded font-bold">
              Anasayfa
            </a>
            <a href="/" className="text-white hover:text-blue-200 px-4 py-2 rounded font-bold">
              Kampanyalar
            </a>
            <a href="/" className="text-white hover:text-blue-200 px-4 py-2 rounded font-bold">
              Müşteri Hizmetleri
            </a>
            
            {isLoggedIn && user.role !== 'ADMIN' && (
              <div 
                  className="relative"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                  <button className="p-2 text-white hover:text-blue-200 flex items-center space-x-2">
                      <CircleUser className="h-6 w-6" />
                      <span className="text-sm font-medium">{user.username}</span>
                  </button>
                  <AnimatePresence>
                      {isUserMenuOpen && (
                          <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50 overflow-hidden divide-y divide-gray-100"
                          >
                              <a 
                                href="/orders" 
                                onClick={(e) => {e.preventDefault(); handleUserMenuClick('/orders');}}
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-medium"
                              >
                                Siparişlerim
                              </a>
                              <a 
                                href="/logout" 
                                onClick={(e) => {e.preventDefault(); handleUserMenuClick('/logout');}}
                                className="block px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
                              >
                                Çıkış Yap
                              </a>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
            )}

            {!isLoggedIn && (
              <button 
                onClick={() => navigate('/auth')}
                className="p-2 text-white hover:text-blue-200 flex items-center space-x-2"
              >
                <CircleUser className="h-6 w-6" />
                <span className="text-sm font-medium">Giriş Yap</span>
              </button>
            )}

            {isLoggedIn && user.role === 'ADMIN' && (
              <button 
                onClick={() => navigate('/admin')}
                className="bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded flex items-center space-x-2 font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <div 
                className="relative"
                onMouseEnter={() => setIsCartOpen(true)}
                onMouseLeave={() => setIsCartOpen(false)}
            >
              <button className="relative p-2 text-white hover:text-blue-200">
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
                  >
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">Sepetim</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-2">
                      {cartItems.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Sepetiniz boş</div>
                      ) : (
                        cartItems.map((item) => {
                          const imageUrl = getFirstValidImage(item);
                          
                          return (
                            <div key={item.productId} className="flex items-center justify-between p-2 border-b">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden relative flex-shrink-0">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={item.productName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => handleImageError(e, imageUrl, item)}
                                      onLoad={handleImageLoad}
                                    />
                                  ) : null}
                                  <Package 
                                    className="fallback-icon h-5 w-5 text-gray-400 absolute" 
                                    style={{display: imageUrl ? 'none' : 'block'}} 
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                                  <p className="text-sm text-gray-500">
                                    ₺{typeof item.price === 'number' ? 
                                      item.price.toLocaleString('tr-TR') : 
                                      parseFloat(item.price).toLocaleString('tr-TR')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)} 
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)} 
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => removeFromCart(item.productId)} 
                                  className="p-1 hover:bg-gray-100 rounded text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {cartItems.length > 0 && (
                      <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold">Toplam:</span>
                          <span className="font-bold text-lg text-blue-600">
                            ₺{getTotalPrice().toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <button 
                          onClick={handleCartView} 
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                          Sepeti Görüntüle
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
              <div className="relative">
                <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative p-2 text-white hover:text-blue-200">
                    <ShoppingCart className="h-6 w-6" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                </button>
                <AnimatePresence>
                  {isCartOpen && (
                      <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-32px)] bg-white rounded-lg shadow-xl border z-50"
                      >
                           <div className="p-4 text-center text-gray-800">
                              <h3 className="text-lg font-semibold mb-2">Sepet Özeti</h3>
                              <p className="text-sm">Toplam Ürün: {getTotalItems()}</p>
                              <p className="font-bold text-blue-600 mb-3">₺{getTotalPrice().toLocaleString('tr-TR')}</p>
                              <button 
                                onClick={handleCartView} 
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                              >
                                Sepeti Görüntüle
                              </button>
                          </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-blue-200 p-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-700 overflow-hidden">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {isLoggedIn && (
                <div className="px-3 py-2 text-white font-semibold border-b border-blue-600 mb-2">
                  Hoş geldin, {user.username}
                </div>
              )}
              
              <a href="/" className="block px-3 py-2 text-white hover:bg-blue-600 rounded">Anasayfa</a>
              <a href="/" className="block px-3 py-2 text-white hover:bg-blue-600 rounded">Kampanyalar</a>
              <a href="/" className="block px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded font-semibold">Müşteri Hizmetleri</a>
              
              {isLoggedIn ? (
                <>
                  {user.role !== 'ADMIN' && (
                    <a 
                      href="/orders" 
                      onClick={(e) => {e.preventDefault(); handleUserMenuClick('/orders');}}
                      className="block px-3 py-2 text-white hover:bg-blue-600 rounded"
                    >
                      Siparişlerim
                    </a>
                  )}
                  <a 
                    href="/logout" 
                    onClick={(e) => {e.preventDefault(); handleUserMenuClick('/logout');}}
                    className="block px-3 py-2 text-white hover:bg-blue-600 rounded"
                  >
                    Çıkış Yap
                  </a>
                  
                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => {setMobileMenuOpen(false); navigate('/admin');}}
                      className="w-full text-left px-3 py-2 text-white bg-blue-500 hover:bg-blue-400 rounded flex items-center space-x-2 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                </>
              ) : (
                <a 
                  href="/auth" 
                  onClick={(e) => {e.preventDefault(); handleUserMenuClick('/auth');}}
                  className="block px-3 py-2 text-white hover:bg-blue-600 rounded"
                >
                  Giriş Yap / Kayıt Ol
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-red-600 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-center text-white text-sm font-semibold h-10 relative">
          {mainCategories.map((cat, index) => (
            <div
              key={cat.name}
              className="relative px-4 flex items-center cursor-pointer hover:bg-red-700 transition-all group"
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleMainCategoryClick(cat.name)}
            >
              {index !== 0 && <div className="border-l border-white/30 h-4 mx-3"></div>}
              <span className="relative z-10 select-none uppercase">{cat.name}</span>
              <AnimatePresence>
                {hoveredCategory === cat.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white text-gray-900 rounded-xl shadow-2xl ring-1 ring-black/5 min-w-56 z-50 overflow-hidden divide-y divide-gray-100"
                  >
                    {cat.subCategories.map((sub, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubCategoryClick(sub);
                        }}
                        className="block px-5 py-3 hover:bg-gray-100 text-sm font-medium transition-colors cursor-pointer"
                      >
                        {sub}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;