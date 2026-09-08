import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/Common';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError(t('admin.loginError'));
      return;
    }

    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res && res.success) {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setError(res?.message || t('admin.invalidCredentials'));
      }
    } catch (err) {
      setError(err?.message || t('admin.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muru-pink-soft/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-muru-border/60 shadow-xl shadow-muru-pink/5 p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muru-pink-soft text-muru-pink mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-[0.18em] text-muru-text-main">
            MURU
          </h1>
          <p className="text-sm font-semibold uppercase tracking-wider text-muru-text-secondary">
            {t('admin.loginTitle')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muru-text-main">
              {t('admin.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muru-text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.emailPlaceholder')}
                required
                className="w-full pl-10 pr-4 py-3 bg-muru-pink-soft/20 border border-muru-border/60 rounded-xl text-sm text-muru-text-main placeholder-muru-text-secondary/60 focus:outline-none focus:border-muru-pink focus:ring-2 focus:ring-muru-pink/20 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muru-text-main">
              {t('admin.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muru-text-secondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-muru-pink-soft/20 border border-muru-border/60 rounded-xl text-sm text-muru-text-main placeholder-muru-text-secondary/60 focus:outline-none focus:border-muru-pink focus:ring-2 focus:ring-muru-pink/20 transition-all"
              />
            </div>
          </div>

          {/* Login Submit Button */}
          <Button
            type="submit"
            loading={loading}
            className="w-full gap-2"
          >
            {!loading && (
              <>
                <span>{t('admin.loginButton')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-muru-border/30">
          <p className="text-xs text-muru-text-secondary">
            {t('admin.loginFooter')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
