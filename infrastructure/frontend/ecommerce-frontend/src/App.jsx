import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./components/AuthContext";
import ProductList from "./components/ProductList";
import Layout from "./components/Layout";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import CategoryPage from "./components/CategoryPage";
import CheckoutFlow from "./components/CheckoutFlow";
import OrderList from "./components/OrderList";
import Auth from "./components/Auth";
import Logout from "./components/Logout";
import AuthTest from './components/AuthTest';
import SimpleDebugTest from './components/SimpleDebugTest';
import LocationTestPage from './components/LocationTestPage';
import AdminDashboard from './components/AdminDashboard';
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import FAQPage from "./components/FAQPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="logout" element={<Logout />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<CheckoutFlow />} />
            <Route path=":slugWithId" element={<ProductDetail />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="main-category/:categoryName" element={<CategoryPage isMainCategory={true} />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:orderId" element={<OrderList />} />
            <Route path="location-test" element={<LocationTestPage />} />
            <Route path="auth" element={<Auth />} />
            <Route path="hakkimizda" element={<AboutPage />} />
            <Route path="iletisim" element={<ContactPage />} />
            <Route path="sss" element={<FAQPage />} />
            <Route path="urunler" element={<ProductList />} />        
            <Route path="kargo" element={
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Kargo ve Teslimat</h1>
                <p className="text-gray-600">Bu sayfa yakında eklenecek...</p>
              </div>
            } />
            <Route path="iade" element={
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-4">İade ve Değişim</h1>
                <p className="text-gray-600">Bu sayfa yakında eklenecek...</p>
              </div>
            } />
            <Route path="gizlilik" element={
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>
                <p className="text-gray-600">Bu sayfa yakında eklenecek...</p>
              </div>
            } />
            
            <Route path="*" element={
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Aradığınız sayfa bulunamadı</p>
                <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700 transition-colors">
                  Ana Sayfaya Dön
                </a>
              </div>
            } />
          </Route>

          <Route path="debug" element={<AuthTest />} />
          <Route path="SimpleDebugTest" element={<SimpleDebugTest />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;