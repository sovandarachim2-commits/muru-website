import React, { useEffect, useState } from 'react';
import { SectionTitle } from '../../components/Layout';
import { Button, SkeletonTable } from '../../components/Common';
import { 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  Star, 
  Plus, 
  Layout, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { adminContentService } from '../../api/services/adminContentService';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-muru-border shadow-sm flex items-center gap-5">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-muru-text-secondary mb-1">{label}</p>
      <p className="text-3xl font-bold text-muru-text-main">{value}</p>
    </div>
  </div>
);

const QuickAction = ({ label, icon: Icon, to }) => (
  <Link 
    to={to}
    className="flex items-center justify-between p-4 rounded-xl border border-muru-border bg-white hover:border-muru-pink hover:bg-muru-pink-soft/30 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
        <Icon className="w-5 h-5 text-muru-text-main group-hover:text-muru-pink" />
      </div>
      <span className="font-semibold text-muru-text-main">{label}</span>
    </div>
    <ArrowRight className="w-4 h-4 text-muru-text-secondary group-hover:text-muru-pink transform group-hover:translate-x-1 transition-all" />
  </Link>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminContentService.getDashboard();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error(t('admin.loadDashboardError'));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-10">
        <div className="h-20 bg-slate-100 rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  const { stats, recent_products } = data || { 
    stats: { total_products: 0, active_products: 0, hidden_products: 0, featured_products: 0 },
    recent_products: [] 
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionTitle 
          title={t('admin.dashboardTitle')} 
          subtitle={t('admin.dashboardSubtitle')} 
          className="mb-0"
        />
        <div className="flex items-center gap-3">
          <Link to="/admin/products/create">
            <Button 
              variant="primary" 
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('admin.addProduct')}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label={t('admin.totalProducts')} 
          value={stats.total_products} 
          icon={ShoppingBag} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          label={t('admin.activeProducts')} 
          value={stats.active_products} 
          icon={Eye} 
          color="bg-green-50 text-green-600" 
        />
        <StatCard 
          label={t('admin.hiddenProducts')} 
          value={stats.hidden_products} 
          icon={EyeOff} 
          color="bg-slate-100 text-slate-600" 
        />
        <StatCard 
          label={t('admin.featuredProducts')} 
          value={stats.featured_products} 
          icon={Star} 
          color="bg-amber-50 text-amber-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products Table */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <h3 className="text-xl font-bold text-muru-text-main flex items-center gap-2">
            {t('admin.recentProducts')}
          </h3>
          <div className="bg-white rounded-2xl border border-muru-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-muru-border text-xs uppercase tracking-widest text-muru-text-secondary">
                  <tr>
                    <th className="px-6 py-4 font-semibold">{t('admin.product')}</th>
                    <th className="px-6 py-4 font-semibold text-center">{t('admin.price')}</th>
                    <th className="px-6 py-4 font-semibold text-center">{t('admin.status')}</th>
                    <th className="px-6 py-4 font-semibold text-center">{t('admin.updated')}</th>
                    <th className="px-6 py-4 font-semibold text-right">{t('admin.action')}</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-muru-border">
                {recent_products.length > 0 ? recent_products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muru-pink-soft overflow-hidden">
                          {product.primary_image ? (
                            <img src={product.primary_image.url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-muru-pink/40" />
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-muru-text-main">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-muru-text-main font-medium">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muru-text-secondary">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/products/${product.id}/edit`} className="text-muru-pink font-semibold hover:text-muru-pink-dark">
                        {t('admin.edit')}
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-muru-text-secondary">
                      {t('admin.noProducts')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 p-4 text-center border-t border-muru-border">
            <Link to="/admin/products" className="text-sm font-semibold text-muru-pink hover:underline">
              {t('admin.viewAllProducts')}
            </Link>
          </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-muru-text-main">{t('admin.quickActions')}</h3>
          <div className="grid grid-cols-1 gap-4">
            <QuickAction label={t('admin.addNewProduct')} icon={Plus} to="/admin/products/create" />
            <QuickAction label={t('admin.editHomepage')} icon={Layout} to="/admin/homepage" />
            <QuickAction label={t('admin.editContactInfo')} icon={Phone} to="/admin/contact" />
          </div>

          <div className="bg-muru-pink rounded-2xl p-8 text-white space-y-4 shadow-xl shadow-muru-pink/20">
            <h4 className="text-xl font-bold">{t('admin.muruAdmin')}</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('admin.promoText')}
            </p>
            <Button 
              variant="secondary" 
              className="w-full bg-white text-muru-pink hover:bg-white/90 border-none"
              onClick={() => window.open('/', '_blank')}
            >
              {t('admin.livePreview')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
