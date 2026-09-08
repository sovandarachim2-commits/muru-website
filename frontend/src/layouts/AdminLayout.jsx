import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Home as HomeIcon, 
  Info, 
  Phone, 
  Settings, 
  Users, 
  ExternalLink, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../api/utils';
import { adminAuthService } from '../api/services/adminAuthService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const SidebarLink = ({ to, icon: Icon, children, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-muru-pink text-white shadow-lg shadow-muru-pink/20" 
        : "text-muru-text-secondary hover:bg-muru-pink-soft hover:text-muru-pink"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:text-muru-pink")} />
    <span className="font-medium">{children}</span>
  </Link>
);

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { name: t('admin.dashboard'), path: '/admin', icon: LayoutDashboard },
    { name: t('admin.products'), path: '/admin/products', icon: ShoppingBag },
    { name: t('admin.homepage'), path: '/admin/homepage', icon: HomeIcon },
    { name: t('admin.aboutUs'), path: '/admin/about', icon: Info },
    { name: t('admin.contact'), path: '/admin/contact', icon: Phone },
    { name: t('admin.websiteSettings'), path: '/admin/settings', icon: Settings },
    { name: t('admin.users'), path: '/admin/users', icon: Users },
  ];

  const isActive = (itemPath) => {
    if (itemPath === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(itemPath);
  };

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      localStorage.removeItem('muru_admin_token');
      toast.success(t('admin.logoutSuccess'));
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('muru_admin_token');
      navigate('/login');
    }
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'A';
  const userName = user?.name || t('admin.administrator');
  const userRole = user?.role || t('admin.muruOfficial');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-muru-border z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          {/* Logo & Close Button (Mobile) */}
          <div className="mb-10 px-4 flex items-center justify-between">
            <Link to="/admin" className="text-3xl font-bold tracking-tighter text-muru-pink">
              MURU <span className="text-xs font-medium text-muru-text-secondary align-top ml-1">Admin</span>
            </Link>
            <button 
              className="lg:hidden text-muru-text-secondary hover:text-muru-pink transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow space-y-2">
            {menuItems.map((item) => (
              <SidebarLink
                key={item.path}
                to={item.path}
                icon={item.icon}
                active={isActive(item.path)}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.name}
              </SidebarLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-muru-border space-y-2">
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muru-text-secondary hover:bg-muru-pink-soft hover:text-muru-pink transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">{t('admin.viewWebsite')}</span>
            </a>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-muru-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-muru-text-main p-1 -ml-1 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Mobile Logo Visibility */}
            <div className="lg:hidden font-bold tracking-tighter text-muru-pink text-xl">
              MURU
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-muru-text-main">{userName}</p>
              <p className="text-xs text-muru-text-secondary text-muru-pink">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-muru-pink-soft flex items-center justify-center text-muru-pink font-bold border border-muru-pink/20">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-10 max-w-7xl min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
