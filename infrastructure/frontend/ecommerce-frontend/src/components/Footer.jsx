import { 
  MapPin, Phone, Mail, Facebook, Twitter, Instagram, 
  Youtube, Send, Heart, CreditCard, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: 'Hakkımızda', path: '/hakkimizda' },
    { title: 'İletişim', path: '/iletisim' },
    { title: 'Sıkça Sorulan Sorular', path: '/sss' },
    { title: 'Kargo ve Teslimat', path: '/kargo' },
    { title: 'İade ve Değişim', path: '/iade' },
    { title: 'Gizlilik Politikası', path: '/gizlilik' }
  ];

  const categories = [
    { title: 'Elektronik', path: '/main-category/Elektronik' },
    { title: 'Beyaz Eşya', path: '/main-category/Beyaz Eşya' },
    { title: 'Ankastre', path: '/main-category/Ankastre' },
    { title: 'Ev Aletleri', path: '/main-category/Ev Aletleri' },
    { title: 'İklimlendirme', path: '/main-category/İklimlendirme' },
    { title: 'Akıllı Ürünler', path: '/main-category/Akilli Ürünler' },
    { title: 'Mobilite', path: '/main-category/Mobilite' },
    { title: 'Diğer Ürünler', path: '/main-category/Diğer Ürünler' }
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com', color: 'hover:bg-blue-600' },
    { icon: Twitter, url: 'https://twitter.com', color: 'hover:bg-blue-400' },
    { icon: Instagram, url: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { icon: Youtube, url: 'https://youtube.com', color: 'hover:bg-red-600' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              HTech
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Teknolojinin gücünü evinize taşıyoruz. En yeni ve en kaliteli ürünler HTech güvencesiyle.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm">
                  Atatürk Mah. Teknoloji Cad. No:123<br />
                  Kadıköy, İstanbul
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a href="tel:+902161234567" className="text-gray-400 hover:text-white transition-colors text-sm">
                  0216 123 45 67
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                <a href="mailto:info@htech.com.tr" className="text-gray-400 hover:text-white transition-colors text-sm">
                  info@htech.com.tr
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Kurumsal</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    › {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Kategoriler</h4>
            <ul className="space-y-2">
              {categories.map((cat, index) => (
                <li key={index}>
                  <Link 
                    to={cat.path}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    › {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Bültenimize Katılın</h4>
            <p className="text-gray-400 text-sm mb-4">
              Kampanyalardan ve yeni ürünlerden ilk siz haberdar olun!
            </p>
            
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold mb-3 text-gray-300">Bizi Takip Edin</h5>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ${social.color} transition-all transform hover:scale-110`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Ödeme Yöntemleri
              </h5>
              <div className="flex gap-3 flex-wrap">
                {['Visa', 'Mastercard', 'Troy', 'PayPal', 'Apple Pay'].map((payment, index) => (
                  <div key={index} className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-medium text-gray-400">
                    {payment}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Güvenli Alışveriş
              </h5>
              <div className="flex gap-3 flex-wrap">
                {['SSL Sertifikası', '3D Secure', 'Güvenli Ödeme'].map((security, index) => (
                  <div key={index} className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-medium text-green-400">
                    ✓ {security}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400 text-center md:text-left">
              © {currentYear} <span className="font-semibold text-white">HTech</span>. Tüm hakları saklıdır.
            </p>
            <p className="text-gray-500 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 inline animate-pulse" /> in Istanbul
            </p>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 pb-safe">
        <div className="flex justify-around items-center py-2">
          <Link to="/" className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Ana Sayfa</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Sepet</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Siparişler</span>
          </Link>
          <Link to="/auth" className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Hesabım</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;