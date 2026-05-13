# E-Commerce Microservices Project

A fully modular **microservice-based e-commerce platform** built with **Spring Boot, Kafka, MongoDB, Elasticsearch, React, and Docker**. This project demonstrates scalable architecture, event-driven communication, and modern frontend integration suitable for production-level systems.

---

## 🚀 Overview

This project is designed as a complete online store system where users can browse products, manage their cart, complete checkout, and place orders. Each domain is isolated into its own microservice to ensure scalability, maintainability, and independent deployment.

---

## 🏗️ Architecture

The system follows a **microservices architecture**, where each service handles a single responsibility:

* **Product Service** – Manages product data, categories, images, stock, and details.
* **Order Service** – Handles order creation, order items, order history, and order status.
* **User Service** – Stores user profiles and shipping addresses.
* **Cart Service** – Manages user cart with item quantity updates.
* **Search Service** – Elasticsearch-powered full-text product search with Kibana monitoring.
* **Gateway / API Gateway** – Routes requests to microservices via Nginx.
* **Kafka** – Used for asynchronous communication between services.

---

## 🧰 Tech Stack

### **Infrastructure**

| Tool | Version |
|------|---------|
| Nginx | Reverse Proxy / Load Balancer |
| Docker | Latest |
| Docker Compose | v2+ |

### **Backend**

| Technology | Version |
|------------|---------|
| Java | 17 |
| Maven | 3.x |
| Spring Boot | 3.5.4 |
| Spring Cloud | 2025.0.0 |
| Spring Cloud OpenFeign | (via Spring Cloud BOM) |
| Spring Security + JWT | JJWT 0.11.5 |
| Spring Data MongoDB | (via Spring Boot BOM) |
| Apache Kafka | (via Docker) |
| Elasticsearch | (via Docker) |
| Lombok | (via Spring Boot BOM) |
| WebSocket | (via Spring Boot BOM) |

### **Frontend**

| Technology | Version |
|------------|---------|
| Node.js | 18+ |
| React | 18.x |
| Vite | 5.x |
| TailwindCSS | 3.x |
| Axios | Latest |

### **Database & Search**

| Tool | Version |
|------|---------|
| MongoDB | (via Docker) |
| Elasticsearch | (via Docker) |
| Kibana | (via Docker) |

---

## 📦 Services Detail

### 1️⃣ **Product Service** (Port: 8081)

Handles:

* Product CRUD (TV, Refrigerator, Dishwasher, PC, and more)
* Categories (main & sub categories)
* Stock management
* Image upload & management
* Admin product management endpoints

### 2️⃣ **Order Service** (Port: 8082)

Handles:

* Order creation
* Order item mapping
* Address management
* Order status management (PENDING → PROCESSING → SHIPPED → DELIVERED)
* Kafka order events

### 3️⃣ **User Service** (Port: 8084)

Handles:

* User registration & login (JWT)
* Guest user support
* Address management
* Role-based access (ADMIN / USER)

### 4️⃣ **Cart Service**

Handles:

* Add / remove / update cart items
* Guest cart & user cart migration on login
* Cart total calculation

### 5️⃣ **Search Service**

Handles:

* Full-text product search powered by **Elasticsearch**
* Product indexing via **Kafka** events
* Search result ranking & filtering
* **Kibana** dashboard for monitoring indices

### 6️⃣ **Frontend Application (React)**

Components include:

* `HomePage` with featured products
* `ProductList` & `ProductDetail` pages
* `CheckoutFlow` (multi-step order flow)
* `AdminDashboard` with product & order management
* `Auth` (login / register)
* Custom `Navbar` with category dropdown & responsive design

---

## 🔌 Communication Between Services

### 🔐 Authentication & Authorization

Project supports **JWT-based authentication**:

* User login returns JWT token
* Gateway validates the token on each request
* Protected routes require `Authorization: Bearer <token>` header
* Role-based access: **ADMIN** and **USER**
* Guest user support with automatic cart migration on login

### 🔄 Service-to-service Communication

* **Synchronous (REST)** for direct queries
* **Asynchronous (Kafka)** for events:
  * Order created → triggers stock update
  * Product created/updated → triggers Elasticsearch indexing

---

## ▶️ How to Run the Project

### **1. Environment Configuration**

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set your `JWT_SECRET` at minimum:

```dotenv
# JWT
JWT_SECRET=your_secret_key_here
JWT_ACCESS_EXPIRATION=900000
SECURITY_JWT_ENABLED=true

# User Service
USER_SERVICE_PORT=8085
USER_DB_URI=mongodb://localhost:27017/userservice_db

# Cart Service
CART_SERVICE_PORT=8083
CART_DB_URI=mongodb://localhost:27017/cartdb

# Product Service
PRODUCT_SERVICE_PORT=8081
PRODUCT_DB_URI=mongodb://localhost:27017/productdb

# Order Service
ORDER_SERVICE_PORT=8082
ORDER_DB_URI=mongodb://localhost:27017/orderdb

# Kafka
KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092
KAFKA_GROUP_ID=product-group
KAFKA_AUTO_OFFSET_RESET=earliest

# Search-Service
SEARCH_SERVICE_PORT=8084
ELASTIC_SEARCH_URI=https://localhost:9200
ELASTIC_USERNAME=your_username
ELASTIC_PASSWORD=your_password
```

> ⚠️ **Never commit `.env`** — it is in `.gitignore`. Only `.env.example` is tracked by git.

---

### **2. Docker Compose Configuration**

Copy the example docker-compose file:

```bash
cp docker-compose.yml.example docker-compose.yml
```

This starts the following services:

| Container | Port |
|-----------|------|
| Kafka (Bitnami KRaft) | 9092 |
| API Gateway (OpenResty + JWT) | 80 |
| Elasticsearch | 9200 |
| Kibana | 5601 |

> ⚠️ **Never commit `docker-compose.yml`** — it may contain secrets. Only `docker-compose.yml.example` is tracked by git.

---

### **3. Start Infrastructure**

```bash
docker compose up -d
```

---

### **4. Start Backend Services**

Run each microservice from its own directory:

```bash
mvn clean install
mvn spring-boot:run
```

| Service | Port |
|---------|------|
| Product Service | 8081 |
| Order Service | 8082 |
| Cart Service | 8083 |
| User Service | 8085 |
| Search Service | 8084 |

---

### **5. Start Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Features

* Full e-commerce workflow (browse → cart → checkout → order)
* Role-based admin panel (product & order management)
* Elasticsearch-powered product search
* Event-driven architecture with Kafka
* Guest user support with cart migration
* JWT authentication with role-based access control
* Real-time notifications via WebSocket
* Responsive UI with TailwindCSS
* Modular microservice structure

---

## 🗺️ Roadmap / Future Improvements

* [ ] Nginx SSL termination (Let's Encrypt)
* [ ] Distributed tracing (Zipkin / OpenTelemetry)
* [ ] Centralized logging (ELK Stack or Loki)
* [ ] Authentication refresh tokens
* [ ] Payment service integration
* [ ] Recommendation engine (Elasticsearch-based)
* [ ] Search autocomplete & filters
* [ ] CI/CD pipeline (GitHub Actions)

---

## 📷 Screenshots

(Add images here if available)

---


---

## 👤 Author

Developed by **Şehit Celil Güvensen**
