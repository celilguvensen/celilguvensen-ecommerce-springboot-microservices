import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, UserPlus, LogIn, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { login, register } = useAuth();
  const { loadCart } = useCart();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      await login(loginForm);
      await loadCart();
      // navigate("/") ← BUNU KALDIRIN, AuthContext hallediyor
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.data?.message) {
        setLoginError(err.response.data.message);
      } else if (err.message?.includes("Network Error")) {
        setLoginError("Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        setLoginError("Kullanıcı adı veya şifre hatalı!");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setRegisterError("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess(false);
    setRegisterLoading(true);

    try {
      await register(registerForm);
      setRegisterSuccess(true);
      setTimeout(() => {
        setActiveTab("login");
        setRegisterSuccess(false);
        setLoginForm({
          username: registerForm.username,
          password: registerForm.password
        });
      }, 2000);
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage = err.response?.data?.error || err.message || "Kayıt başarısız";
      setRegisterError(errorMessage);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        background: 'linear-gradient(to bottom right, #401008, #210703, #E80000)',
        minHeight: '100vh'
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("login");
                setLoginError("");
                setRegisterError("");
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <LogIn className="w-5 h-5" />
              Giriş Yap
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setLoginError("");
                setRegisterError("");
                setRegisterSuccess(false);
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "register"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              Kayıt Ol
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Hoş Geldiniz</h2>
                <p className="text-gray-500 mt-1">Hesabınıza giriş yapın</p>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                  <span className="text-red-500">⚠️</span>
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="username"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    required
                    disabled={loginLoading}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
                    placeholder="Kullanıcı adınızı girin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                    disabled={loginLoading}
                    className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
                    placeholder="Şifrenizi girin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loginLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Giriş Yap
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Hesap Oluştur</h2>
                <p className="text-gray-500 mt-1">Yeni bir hesap açın</p>
              </div>

              {registerSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <h3 className="font-bold">✅ Kayıt Başarılı!</h3>
                  <p>Hesabınız oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...</p>
                </div>
              )}

              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {registerError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">
                    Kullanıcı Adı *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="username"
                      type="text"
                      value={registerForm.username}
                      onChange={handleRegisterChange}
                      required
                      disabled={registerLoading}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">
                    E-posta *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="email"
                      type="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required
                      disabled={registerLoading}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Şifre *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                    disabled={registerLoading}
                    className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="En az 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">
                    Ad
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={registerForm.firstName}
                    onChange={handleRegisterChange}
                    disabled={registerLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Adınız"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium">
                    Soyad
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={registerForm.lastName}
                    onChange={handleRegisterChange}
                    disabled={registerLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Soyadınız"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="phone"
                    type="tel"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    disabled={registerLoading}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {registerLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Kayıt olunuyor...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Kayıt Ol
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;