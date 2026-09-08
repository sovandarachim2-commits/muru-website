# MURU - Premium Skincare Brand Website

MURU is a production-ready cosmetics skincare brand website built with a modern tech stack, focusing on a premium aesthetic and high performance. It features a complete content management system (CMS) for the admin to manage products, homepage content, and website settings, while providing a seamless lead generation flow to Telegram for customers.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router 7.
- **Backend**: Laravel 12 (REST API), MySQL, Laravel Sanctum.
- **Tools**: XAMPP (Local Server), Composer, Node.js.
- **Design**: Premium, minimalist aesthetic with a soft feminine feel.

## 📂 Project Structure

```text
/muruwebsite
├── /backend            # Laravel 12 REST API
│   ├── /app            # Logic & Controllers
│   ├── /database       # Migrations & Seeders
│   └── /routes         # API Endpoints
├── /frontend           # React 18 + Vite Web App
│   ├── /src/api        # Axios service layer
│   ├── /src/pages      # Public & Admin pages
│   └── /src/components # Reusable UI components
└── .env                # Global environment configuration
```

## 🛠️ Installation & Setup

### 1. Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm
- XAMPP or any local server with MySQL

### 2. Backend Setup
```bash
cd backend
composer install
# Create a database named 'muru_db' in MySQL
# The project uses a global .env file in the root directory
C:\xampp\php\php.exe artisan migrate --seed
C:\xampp\php\php.exe artisan serve --host=0.0.0.0 --port=8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Environment Configuration

The project uses a single global `.env` file at the root directory for both frontend and backend settings.

```env
# Backend
DB_DATABASE=muru_db
DB_USERNAME=root
DB_PASSWORD=

# Frontend & API
VITE_API_URL=http://your-ip-address:8000/api
FRONTEND_URL=http://your-ip-address:5173

# Image storage: Cloudflare R2
IMAGE_STORAGE_DISK=r2
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=your-bucket-name
R2_REGION=auto
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_URL=https://your-public-r2-domain.example.com
```

## 🔑 Admin Access

The admin dashboard is accessible at `/admin`. It allows full control over:
- **Product Management**: CRUD operations, ingredients, benefits, and SEO.
- **Homepage Management**: Hero sections, signature products, and brand stories.
- **About & Contact**: Dynamic content management.
- **Settings**: Brand logo, Telegram links, social media, and SEO metadata.

## 📝 Features
- **Dynamic SEO**: Powered by `react-helmet-async`.
- **Responsive Design**: Optimized for Desktop, Laptop, Tablet, and Mobile.
- **Lead Flow**: All product inquiries are routed directly to Telegram.
- **Zero Horizontal Overflow**: Guaranteed layout stability across all devices.
- **Image Optimization**: WebP support and lazy loading implemented.

---
© 2026 MURU Skincare. Built for production-ready deployment.
