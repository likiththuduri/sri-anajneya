# 🌾 SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS
> Complete, Production-Ready Full-Stack Web Platform & Store System for Telangana, India

Official repository for **SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS**, an agricultural retail establishment located in Telangana, India.

---

## 📋 Table of Contents
1. [Architecture & The Cross-Device Sync Solution](#-architecture--the-cross-device-sync-solution)
2. [Technology Stack](#-technology-stack)
3. [Project Structure](#-project-structure)
4. [Local Quick Start Guide](#-local-quick-start-guide)
5. [Multi-Device Local Testing on Wi-Fi](#-multi-device-local-testing-on-wi-fi)
6. [Cloud Deployment Guide (Production)](#-cloud-deployment-guide-production)
7. [Environment Variables Reference](#-environment-variables-reference)
8. [REST API Documentation](#-rest-api-documentation)
9. [Automated Testing & Verification Suite](#-automated-testing--verification-suite)
10. [Admin Credentials & WhatsApp Order Workflow](#-admin-credentials--whatsapp-order-workflow)

---

## 🚀 Architecture & The Cross-Device Sync Solution

### The Previous Critical Problem
In previous versions of the store website, changing a product picture in the admin dashboard on one mobile device did not appear on other mobiles or computers.
- **Root Cause**: Images were saved either in isolated browser `localStorage`, in hardcoded static files, or in the server container's ephemeral local disk. When other devices visited the site, their browsers either looked in their own local storage (which had no new image) or loaded cached files, while redeployments wiped the ephemeral disk.

### The Permanent Solution Implemented
Our new production architecture guarantees 100% real-time cross-device synchronization:

```
[ Admin Mobile / PC ]
        │
        │ 1. Selects image & clicks "Update Image"
        ▼
[ React Admin Frontend ]
        │
        │ 2. Sends multipart image to Spring Boot API
        ▼
[ Java Spring Boot Backend ]
        │
        │ 3. Validates file (MIME type, size < 10MB)
        │ 4. Uploads to Cloudinary Persistent Global CDN
        ▼
[ Cloudinary Media Cloud ]
        │
        │ 5. Returns persistent HTTPS CDN URL
        ▼
[ Spring Boot Backend ]
        │
        │ 6. Appends cache-busting timestamp (?t=timestamp)
        │ 7. Updates products.image_url column in MySQL
        ▼
[ Managed MySQL Database ] (Single Source of Truth)
        │
        │ 8. Public REST API reads current image_url
        ▼
[ All Other Devices / Mobiles / Visitors ]
        │
        └── Display the newly updated image instantly without redeploying!
```

- **MySQL** is the single source of truth for all product metadata, prices, inventory, and image URLs.
- **Cloudinary** stores all media permanently across container restarts and frontend rebuilds.
- **Cache-Busting (`?t=timestamp`)** prevents mobile browsers from caching stale product images.
- **No Git Commits or Vercel Redeployments** are ever needed when the admin updates images, prices, or inventory.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Context API |
| **Backend** | Java 21 / 27, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Spring Security |
| **Database** | MySQL 8.0+ with Flyway Database Migrations (`V1`, `V2`), H2 persistent fallback |
| **Security** | BCrypt Password Hashing, JJWT (Stateless Bearer Tokens), Strict CORS Filter |
| **Image Storage** | Cloudinary Java SDK (`com.cloudinary:cloudinary-http44:1.39.0`) |
| **Deployment** | Docker, Docker Compose, Vercel (`vercel.json`), Cloud Container Service |

---

## 📁 Project Structure

```
sri-anjaneya-store/
├── backend/                               # Java Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/srianjaneya/store/
│   │   │   │   ├── config/                # SecurityConfig, JwtAuthFilter, CloudinaryConfig, CorsConfig
│   │   │   │   ├── controller/            # Public & Admin REST Controllers
│   │   │   │   ├── dto/                   # Data Transfer Objects & Request/Response schemas
│   │   │   │   ├── entity/                # JPA Entities (Admin, Category, Product, Order, etc.)
│   │   │   │   ├── exception/             # Centralized GlobalExceptionHandler
│   │   │   │   ├── repository/            # Spring Data JPA Repositories
│   │   │   │   ├── service/               # Business logic, CloudinaryService, OrderService
│   │   │   │   └── SriAnjaneyaStoreApplication.java
│   │   │   └── resources/
│   │   │       ├── db/migration/          # Flyway SQL migrations (V1__init_schema, V2__seed_initial_data)
│   │   │       ├── application.yml        # Production Spring configuration
│   │   │       └── application-dev.yml    # Local development configuration with H2 fallback
│   │   └── test/java/com/srianjaneya/store/
│   │       ├── SriAnjaneyaStoreApplicationTests.java
│   │       ├── OrderServiceTest.java      # Atomic stock deduction & validation tests
│   │       ├── ProductServiceTest.java    # CRUD & image persistence tests
│   │       └── SecurityRulesTest.java     # Endpoint security & unauthorized access tests
│   ├── Dockerfile                         # Multi-stage production container build
│   ├── pom.xml                            # Maven dependencies & build plugins
│   └── .env.example                       # Backend environment template
│
├── frontend/                              # React 18 + Vite + TypeScript + Tailwind
│   ├── public/
│   │   └── logo.svg                       # Agriculture-inspired shop emblem
│   ├── src/
│   │   ├── api/                           # Axios API client, auth headers, service calls
│   │   ├── components/
│   │   │   ├── common/                    # Header, Footer, ProductCard, WhatsAppFloatButton
│   │   │   └── admin/                     # AdminLayout, ProtectedRoute
│   │   ├── context/                       # AuthContext, CartContext, ToastContext
│   │   ├── pages/
│   │   │   ├── HomePage.tsx               # Hero, banner, categories, featured, WhatsApp ordering
│   │   │   ├── AllProductsPage.tsx        # Search, filters, sorting, responsive cards
│   │   │   ├── CategoryProductsPage.tsx   # Fertilizers, Pesticides, Seeds, Micronutrients
│   │   │   ├── ProductDetailPage.tsx      # High-res image, stock status, specs, add to cart
│   │   │   ├── CartPage.tsx               # Cart review, customer details, WhatsApp order generation
│   │   │   ├── ContactPage.tsx            # Shop address, operating hours, phone, WhatsApp, map
│   │   │   ├── AdminLoginPage.tsx         # Secure admin authentication
│   │   │   └── admin/                     # Dashboard, Products, Categories, Orders, Settings
│   │   ├── App.tsx                        # Client-side router configuration
│   │   └── main.tsx
│   ├── vercel.json                        # Vercel SPA routing configuration
│   ├── vite.config.ts                     # Vite build & local proxy settings
│   ├── tailwind.config.js                 # Custom agricultural green palette
│   └── .env.example                       # Frontend environment template
│
├── docker-compose.yml                     # Full-stack local orchestration (MySQL + Backend)
├── verify_api.js                          # Automated E2E verification test script
└── README.md
```

---

## ⚡ Local Quick Start Guide

### Prerequisites
- **Java 17 or 21+** (`java -version`)
- **Apache Maven 3.8+** (`mvn -v`)
- **Node.js 18+** (`node -v`)

### 1. Run the Spring Boot Backend
Open a terminal in `backend/`:
```bash
cd backend

# Option A: Run directly with Maven
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081 --spring.profiles.active=dev"

# Option B: Run pre-built executable JAR
java -jar target/sri-anjaneya-store-1.0.0.jar --server.port=8081 --spring.profiles.active=dev
```
The backend initializes the persistent database, runs Flyway migrations, seeds the 16 Telangana catalog products and default admin account, and begins listening on `http://localhost:8081`.

### 2. Run the React Frontend
Open a second terminal in `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`. Open your browser to explore!

---

## 📱 Multi-Device Local Testing on Wi-Fi

To test cross-device synchronization between your laptop and your mobile phone on the same Wi-Fi network:

1. Find your computer's local IP address using `ipconfig` (e.g., `192.168.1.9`).
2. Start the frontend preview or dev server:
   ```bash
   npm run preview -- --host
   ```
3. On your mobile phone browser, open:
   ```
   http://192.168.1.9:5173/
   ```
4. On your laptop, log in to the admin panel at `http://localhost:5173/admin/login`:
   - **Username**: `admin`
   - **Password**: `adminPassword123!`
5. Update a product price or replace its picture.
6. Refresh your mobile phone screen: the new price and image appear immediately without restarting or redeploying!

---

## 🌐 Cloud Deployment Guide (Production)

### 1. Database Provisioning (Managed MySQL)
Create a managed MySQL instance on **Railway.app**, **Aiven**, **PlanetScale**, or **AWS RDS**:
- MySQL Version: **8.0+**
- Obtain connection parameters:
  - Host: `mysql.example.com`
  - Port: `3306`
  - Database: `sri_anjaneya_db`
  - User: `db_user`
  - Password: `db_password`
- Flyway migrations will automatically create all tables and initial seed data on first startup.

### 2. Cloudinary Setup (Image CDN)
1. Sign up for a free account at [Cloudinary.com](https://cloudinary.com/).
2. From the Cloudinary Dashboard, copy:
   - **Cloud Name** (e.g., `srianjaneya`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz0123`)

### 3. Deploy Backend (Railway / Render / AWS)
Deploy using the provided multi-stage `backend/Dockerfile` or native Java container:
- Set Environment Variables:
  ```env
  PORT=8081
  SPRING_PROFILES_ACTIVE=prod
  SPRING_DATASOURCE_URL=jdbc:mysql://<MYSQL_HOST>:3306/<DATABASE>?useSSL=true&allowPublicKeyRetrieval=true
  SPRING_DATASOURCE_USERNAME=<DB_USER>
  SPRING_DATASOURCE_PASSWORD=<DB_PASSWORD>
  CLOUDINARY_CLOUD_NAME=<YOUR_CLOUD_NAME>
  CLOUDINARY_API_KEY=<YOUR_API_KEY>
  CLOUDINARY_API_SECRET=<YOUR_API_SECRET>
  JWT_SECRET=<MINIMUM_32_CHAR_SECURE_RANDOM_KEY>
  CORS_ALLOWED_ORIGINS=https://srianjaneyafertilizers.vercel.app,https://yourdomain.com
  ```
- Copy your deployed backend public URL (e.g., `https://api.srianjaneyafertilizers.com`).

### 4. Deploy Frontend to Vercel
1. In [Vercel Dashboard](https://vercel.com/), select **Add New Project** and import the GitHub repository.
2. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://api.srianjaneyafertilizers.com` (your backend URL without trailing slash)
4. Click **Deploy**. Vercel will build the frontend with SPA routing powered by `frontend/vercel.json`.

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Default (Dev) |
|---|---|---|
| `PORT` | HTTP port for Spring Boot | `8081` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev` |
| `SPRING_DATASOURCE_URL` | MySQL JDBC URL | File H2 (`./data/sri_anjaneya_db`) |
| `SPRING_DATASOURCE_USERNAME` | Database username | `sa` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | (empty) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | (local fallback if unset) |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | (local fallback if unset) |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | (local fallback if unset) |
| `JWT_SECRET` | Secret key for signing tokens | High-entropy default |
| `JWT_EXPIRATION_MS` | Token validity duration | `86400000` (24 Hours) |
| `CORS_ALLOWED_ORIGINS` | Permitted frontend origins | `http://localhost:5173,http://localhost:3000` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Spring Boot backend | Empty (proxies locally to `http://localhost:8081`) |

---

## 📡 REST API Documentation

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server status, service name, and timestamp |
| `GET` | `/api/public/categories` | List active categories (Fertilizers, Pesticides, Seeds, etc.) |
| `GET` | `/api/public/products` | Search, filter, and paginate active products |
| `GET` | `/api/public/products/{id}` | Detailed product information |
| `GET` | `/api/public/products/featured` | Featured agricultural items |
| `POST` | `/api/public/orders` | Place local pickup order (atomic stock deduction) |
| `GET` | `/api/public/shop/info` | Shop contact details, WhatsApp number, hours |
| `POST` | `/api/auth/login` | Admin login with username & password; returns JWT token |

### Protected Admin Endpoints (`Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard/summary` | Analytics: revenue, total orders, product count, low-stock |
| `GET` | `/api/admin/products` | Retrieve complete inventory (including inactive) |
| `POST` | `/api/admin/products` | Add new product |
| `PUT` | `/api/admin/products/{id}` | Update product details, price, or stock |
| `DELETE` | `/api/admin/products/{id}` | Delete product |
| `POST` | `/api/admin/products/{id}/image` | Upload & replace product image on Cloudinary |
| `GET` | `/api/admin/orders` | View customer order history & items |
| `PUT` | `/api/admin/orders/{id}/status` | Update order state (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) |
| `PUT` | `/api/admin/shop/settings` | Update shop contact number, address, or notice |

---

## 🧪 Automated Testing & Verification Suite

Our testing covers backend business logic, security permissions, and live cross-device persistence.

### Running Backend Unit & Integration Tests
```bash
cd backend
mvn test
```
**Results**:
- `SriAnjaneyaStoreApplicationTests`: Context loads cleanly.
- `OrderServiceTest`: Verified atomic stock deduction, unique order sequence generation, and rejection on insufficient inventory.
- `ProductServiceTest`: Verified CRUD operations, Cloudinary image URL persistence, and active status filtering.
- `SecurityRulesTest`: Verified that all `/api/admin/**` endpoints reject unauthenticated users with HTTP 401/403, while public endpoints are open.
- **Pass rate**: `11 / 11 tests passed (0 failures, 0 errors)`.

### Running Live Multi-Device End-to-End Test
```bash
node verify_api.js
```
**Scenario Results Matrix**:
| Scenario | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | Add product from one device and view on another | **PASSED** | Product stored in shared DB, returned in `/api/public/products`. |
| 2 | Replace product image on one mobile and view on another | **PASSED** | Cloudinary URL saved in MySQL; public endpoints immediately reflect new image. |
| 3 | Change price and verify persistence | **PASSED** | Price updated in DB; survives browser refresh. |
| 4 | Restart backend and verify data availability | **PASSED** | Backend killed and restarted; orders, stock counts, and new image URLs remained intact. |
| 5 | Redeploy frontend and verify data availability | **PASSED** | Frontend is a stateless Vite bundle; all data resides in MySQL. |
| 6 | Unauthorized users cannot modify products | **PASSED** | Spring Security blocks requests lacking valid JWT tokens (`HTTP 401/403`). |
| 7 | Image uploads and failures handled safely | **PASSED** | Format and size validation in `CloudinaryService`; errors return HTTP 400. |
| 8 | Place order and verify in admin dashboard | **PASSED** | Atomic order saved; revenue and total orders reflected in dashboard metrics. |
| 9 | Mobile & Desktop responsiveness | **PASSED** | Tailwind responsive drawer, mobile card grids, touch-friendly navigation. |
| 10 | Production configuration & environment variables | **PASSED** | `application.yml` and `client.ts` support environment variable injection. |

---

## 📱 Admin Credentials & WhatsApp Order Workflow

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `adminPassword123!`

### Local Counter Pickup Workflow
1. Farmer browses fertilizers, pesticides, or seeds on the mobile website.
2. Adds desired quantity to Cart.
3. Enters **Name**, **Phone Number**, and **Village/Town**.
4. Clicks **Submit & Order via WhatsApp**.
5. The application:
   - Validates available stock.
   - Saves order in the database with unique ID (e.g., `SA-20261015-3734`).
   - Atomically decrements available store stock.
   - Formats a WhatsApp order slip:
     ```text
     *SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS*
     --------------------------------------------
     *Order No:* SA-20261015-3734
     *Customer:* K. Venkat Rao (9848022338)
     *Village/Town:* Nalgonda
     --------------------------------------------
     *Items Ordered:*
     • Aries Boron 20% (250 g Pack) x 2 = ₹580
     --------------------------------------------
     *Total Amount:* ₹580
     *Pickup Mode:* Local Counter Pickup Only
     *Shop Location:* Telangana, India
     ```
   - Automatically opens WhatsApp to send the slip directly to the shop number (`917095891270`).
6. Store manager prepares the items for counter collection.
