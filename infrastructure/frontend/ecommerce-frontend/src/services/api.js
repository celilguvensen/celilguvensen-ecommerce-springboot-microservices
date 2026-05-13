import axios from "axios";


const SERVICES = {
  auth: "/api/auth",
  cart: "/api/cart",
  orders: "/api/orders",
  products: "/api/products"
};

export const getAuthToken = () => localStorage.getItem("token");

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    console.log("Token set:", token.substring(0, 20) + "...");
  } else {
    localStorage.removeItem("token");
  }
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  console.log("Auth cleared");
};


// Guest user management (LAZY LOADING)
let guestUserPromise = null;

export const ensureUserContext = async (requireAuth = false) => {
  const existingToken = getAuthToken();
  const existingUser = localStorage.getItem("user");

  if (existingToken && existingUser) {
    try {
      const userData = JSON.parse(existingUser);

      if (!userData.isGuest) {
        const payload = JSON.parse(atob(existingToken.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          return existingToken;
        } else {
          console.log("Token expired, clearing auth");
          clearAuth();
        }
      } else {
        console.log("Existing guest user session:", userData.username);
        return existingToken;
      }
    } catch (e) {
      console.error("User parse error:", e);
      clearAuth();
    }
  }

  if (!requireAuth) {
    return null;
  }

  if (guestUserPromise) return guestUserPromise;

  console.log("Creating new guest user...");
  guestUserPromise = authInstance
    .post("/guest-token", {})
    .then(res => {
      const token = res.data?.token;
      const userId = res.data?.userId;
      const username = res.data?.username;
      const role = res.data?.role || "ANONYMOUS";
      const email = res.data?.email;

      if (!token || !userId) throw new Error("Invalid guest token response");

      setAuthToken(token);
      const guestUserData = { id: userId, username, email, role, isGuest: true };
      localStorage.setItem("user", JSON.stringify(guestUserData));
      localStorage.setItem("userRole", role);

      console.log("Guest user created:", guestUserData);
      return token;
    })
    .catch(err => {
      console.error("Guest token creation failed:", err);
      clearAuth();
      throw err;
    })
    .finally(() => {
      guestUserPromise = null;
    });

  return guestUserPromise;
};


// Axios instances
export const authInstance = axios.create({
  baseURL: SERVICES.auth,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

authInstance.interceptors.response.use(
  res => res,
  err => {
    console.error("Auth API error:", err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

const createProtectedInstance = (baseURL, serviceName, requireAuthByDefault = false) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" }
  });

  instance.interceptors.request.use(async config => {
    const requireAuth = config.requireAuth !== undefined
      ? config.requireAuth
      : requireAuthByDefault;

    const token = await ensureUserContext(requireAuth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    res => res,
    async err => {
      const originalRequest = err.config || {};
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if (currentUser && currentUser.role !== "ANONYMOUS") {
          console.warn(`${serviceName} 401 - token temizleniyor...`);
          clearAuth();
          const newToken = await ensureUserContext(true);
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        }
      }

      return Promise.reject(err);
    }
  );

  return instance;
};

export const productAPI = createProtectedInstance(SERVICES.products, "Products", false);
export const orderAPI = createProtectedInstance(SERVICES.orders, "Orders", true);


export const cartAPI = (() => {
  const instance = axios.create({
    baseURL: SERVICES.cart,
    timeout: 20000,
    headers: { "Content-Type": "application/json" }
  });

  instance.interceptors.request.use(async config => {
    
    const token = await ensureUserContext(true);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    res => res,
    async err => {
      const originalRequest = err.config || {};
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");

      if (err.response?.status === 401 && !originalRequest._cartRetry) {
        originalRequest._cartRetry = true;
        if (currentUser && currentUser.role !== "ANONYMOUS") {
          clearAuth();
          const newToken = await ensureUserContext(true);
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        }
      }

      return Promise.reject(err);
    }
  );

  return instance;
})();


const migrateCart = async (guestUserId, newUserId, token) => {
  if (!guestUserId || !newUserId || guestUserId === newUserId) return;
  try {
    console.log("Migrating cart from", guestUserId, "to", newUserId);
    await cartAPI.post("/migrate", { guestUserId, newUserId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Cart migration successful");
  } catch (e) {
    console.error("Cart migration failed:", e);
  }
};


// Auth API wrappers
export const authAPI = {
  login: async (data) => {
    const res = await authInstance.post("/login", data);
    const { token, userId, username, email, role } = res.data || {};

    if (token && userId) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const wasGuest = currentUser?.isGuest;
      const guestUserId = currentUser?.id;

      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify({
        id: userId, username, email,
        role: role || "USER",
        isGuest: false
      }));
      localStorage.setItem("userRole", role || "USER");

      if (wasGuest && guestUserId) {
        await migrateCart(guestUserId, userId, token);
      }
    }
    return res.data;
  },

  register: async (data) => {
    const res = await authInstance.post("/register", data);
    const { token, userId, username, email, role } = res.data || {};

    if (token && userId) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const wasGuest = currentUser?.isGuest;
      const guestUserId = currentUser?.id;

      setAuthToken(token);
      const userData = {
        id: userId, username, email,
        role: role || "USER",
        isGuest: false
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", role || "USER");
      console.log("User registered and saved:", userData);

      
      if (wasGuest && guestUserId) {
        await migrateCart(guestUserId, userId, token);
      }
    }
    return res.data;
  },

  guestToken: async () => ({ token: await ensureUserContext(true) }),
  logout: () => clearAuth()
};


// Cart helpers
export const cartHelpers = {
  getCart: async () => {
    const res = await cartAPI.get("");
    return res.data;
  },

  addItem: async (productId, quantity = 1, price = 0) => {
    const res = await cartAPI.post("/items", { productId, quantity, price });
    return res.data;
  },

  removeItem: async (productId) => {
    const res = await cartAPI.delete(`/items/${productId}`);
    return res.data;
  },

  updateItem: async (productId, quantity) => {
    const res = await cartAPI.put(`/items/${productId}`, { quantity });
    return res.data;
  },

  clearCart: async () => {
    const res = await cartAPI.delete("");
    return res.data;
  },

  addItemsFromOrder: async (orderItems) => {
    try {
      const results = [];
      for (const item of orderItems) {
        const result = await cartAPI.post("/items", {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
        results.push(result.data);
      }
      return { success: true, results };
    } catch (error) {
      console.error("Failed to add order items to cart:", error);
      throw error;
    }
  },
};


// Health check
export const healthCheck = {
  auth: () => authInstance.get("/health").catch(e => ({ error: e.message })),
  cart: () => cartAPI.get("/health").catch(e => ({ error: e.message })),
  products: () => productAPI.get("/health").catch(e => ({ error: e.message })),
  orders: () => orderAPI.get("/health").catch(e => ({ error: e.message }))
};


export const orderHelpers = {
  getUserOrders: (userId) => orderAPI.get(`/user/${userId}`),
  getOrderById: (orderId) => orderAPI.get(`/${orderId}`),
  createOrder: (orderData) => orderAPI.post("/checkout", { order: orderData }),
  cancelOrder: (orderId, reason) => orderAPI.delete(`/${orderId}`, { params: { reason } }),

  getLocationHistory: (orderId, startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;
    return orderAPI.get(`/${orderId}/location/history`, { params });
  },

  updateLocation: (orderId, locationData) => orderAPI.put(`/${orderId}/location`, locationData),
  updateStatus: (orderId, statusData) => orderAPI.put(`/${orderId}/status`, statusData),

  createReturnRequest: async (orderId, returnData) => {
    try {
      return await orderAPI.post(`/${orderId}/return`, {
        reason: returnData.reason,
        description: returnData.description || "",
        requestDate: new Date().toISOString()
      });
    } catch (error) {
      console.warn("Return endpoint not implemented yet.");
      return { data: { success: true, message: "İade talebi alındı (simüle)", orderId, returnData } };
    }
  },

  submitReview: async (orderId, reviewData) => {
    try {
      return await orderAPI.post(`/${orderId}/review`, {
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        reviewDate: new Date().toISOString()
      });
    } catch (error) {
      console.warn("Review endpoint not implemented yet.");
      return { data: { success: true, message: "Yorum kaydedildi (simüle)", orderId, reviewData } };
    }
  },

  downloadInvoice: async (orderId) => {
    try {
      return await orderAPI.get(`/${orderId}/invoice`, { responseType: "blob" });
    } catch (error) {
      console.warn("Invoice download endpoint not implemented");
      return null;
    }
  },
};

export default {
  authInstance,
  productAPI,
  orderAPI,
  cartAPI,
  orderHelpers,
  cartHelpers,
  authAPI,
  ensureUserContext,
  healthCheck
};