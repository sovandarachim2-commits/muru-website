import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Products = lazy(() => import('./pages/public/Products'));
const ProductDetail = lazy(() => import('./pages/public/ProductDetail'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Search = lazy(() => import('./pages/public/Search'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const HomepageManagement = lazy(() => import('./pages/admin/HomepageManagement'));
const AboutUsManagement = lazy(() => import('./pages/admin/AboutUsManagement'));
const ContactManagement = lazy(() => import('./pages/admin/ContactManagement'));
const WebsiteSettings = lazy(() => import('./pages/admin/WebsiteSettings'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));

import { Container, SectionTitle } from './components/Layout';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminPlaceholder } from './pages/admin/Modules';

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-pulse text-muru-pink font-medium tracking-widest uppercase">
      MURU Skincare...
    </div>
  </div>
);

const Privacy = () => (
  <div className="py-20">
    <Container>
      <SectionTitle title="Privacy Policy" subtitle="Your privacy is important to us." />
      <div className="prose max-w-none">
        <p>This privacy policy explains how we collect and use your data.</p>
      </div>
    </Container>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <SettingsProvider>
          <AuthProvider>
            <BrowserRouter>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#202020',
                  borderRadius: '1rem',
                  border: '1px solid #F0DDE3',
                  padding: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
                success: {
                  iconTheme: {
                    primary: '#F0527D',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="search" element={<Search />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/create" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  <Route path="homepage" element={<HomepageManagement />} />
                  <Route path="about" element={<AboutUsManagement />} />
                  <Route path="contact" element={<ContactManagement />} />
                  <Route path="settings" element={<WebsiteSettings />} />
                  <Route path="users" element={<AdminPlaceholder title="Users" />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Routes>
            </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </SettingsProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
