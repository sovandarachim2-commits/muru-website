import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Send, Search as SearchIcon, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { languageLabels, languageNames } from '../i18n';

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
  </svg>
);
import { Container } from './Layout';
import { cn } from '../api/utils';
import { useSettings } from '../context/SettingsContext';

const BrandLogo = ({ settings, className, textClassName, icon = false }) => {
  const brandName = settings?.site_name || 'MURU';

  if (settings?.logo) {
    return (
      <span className={cn('inline-flex items-center gap-3', className)}>
        <img src={settings.logo} alt={brandName} className="h-9 w-auto max-w-[140px] object-contain" />
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      {icon && (
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-muru-pink text-white shadow-lg shadow-muru-pink/20">
          <span className="text-base font-bold tracking-[0.12em]">M</span>
        </span>
      )}
      <span className={cn('font-bold tracking-[0.22em] text-muru-text-main', textClassName)}>
        {brandName}
      </span>
    </span>
  );
};

/**
 * Global MURU Header
 * Desktop Layout: [MURU Logo]     Home   Products   About Us   Contact      [Chat on Telegram]
 */
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { language, setLanguage, t } = useLanguage();

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.aboutUs'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const handleTelegramClick = () => {
    const url = settings?.telegram_url || (settings?.telegram ? `https://t.me/${settings.telegram}` : 'https://t.me/muru_skincare');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isSearchPage = location.pathname === '/search';
  const brandName = settings?.site_name || 'MURU';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-muru-border/50 shadow-sm">
      {/* Mobile/Tablet Header (below 1024px) */}
      <div className="lg:hidden flex items-center justify-between h-[72px] px-5 relative">
        {/* Left: Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-[44px] h-[44px] flex items-center justify-center text-muru-text-main hover:text-muru-pink transition-colors focus:outline-none z-10"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Center: MURU Logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 inline-flex items-center group focus:outline-none"
          aria-label="MURU Home"
        >
          <BrandLogo settings={settings} textClassName="text-xl transition-colors group-hover:text-muru-pink" />
        </Link>

        {/* Right Group: Search + Telegram */}
        <div className="flex items-center gap-1.5 z-10">
          <Link
            to="/search"
            className={cn(
              "w-[44px] h-[44px] flex items-center justify-center rounded-full transition-all duration-200 active:scale-95",
              isSearchPage
                ? "bg-muru-pink text-white shadow-lg shadow-muru-pink/20"
                : "text-muru-text-main hover:text-muru-pink hover:bg-muru-pink-soft/50"
            )}
            aria-label="Search"
          >
            <SearchIcon className="w-5 h-5" />
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full text-muru-text-main hover:text-muru-pink hover:bg-muru-pink-soft/50 transition-all duration-200 active:scale-95"
              aria-label="Change language"
            >
              <span className="text-xs font-bold">{languageLabels[language]}</span>
            </button>
            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg border border-muru-border/30 overflow-hidden min-w-[120px]">
                  {Object.entries(languageLabels).map(([code, label]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setLanguage(code);
                        setLangMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2 transition-colors",
                        language === code
                          ? "bg-muru-pink-soft/50 text-muru-pink"
                          : "text-muru-text-main hover:bg-muru-pink-soft/30"
                      )}
                    >
                      <span className="font-bold">{label}</span>
                      <span className="text-muru-text-secondary text-xs">({languageNames[code]})</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleTelegramClick}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full bg-muru-pink hover:bg-muru-pink-dark text-white transition-all duration-200 active:scale-95 shadow-lg shadow-muru-pink/20"
            aria-label="Chat on Telegram"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Header (1024px and above) */}
      <div className="hidden lg:block h-[80px]">
        <Container className="h-full max-w-[1280px]">
          <div className="flex items-center justify-between h-full">
            {/* Logo Left */}
            <Link
              to="/"
              className="inline-flex items-center group focus:outline-none"
              aria-label="MURU Home"
            >
              <BrandLogo settings={settings} textClassName="text-2xl transition-colors group-hover:text-muru-pink" />
            </Link>

            {/* Navigation Center */}
            <nav className="flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "relative py-1 text-[15px] font-medium transition-colors duration-200",
                      isActive
                        ? "text-muru-pink"
                        : "text-muru-text-secondary hover:text-muru-pink"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-muru-pink rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Group: Search + Language + Telegram */}
            <div className="flex items-center gap-3">
              <Link
                to="/search"
                className={cn(
                  "w-[42px] h-[42px] flex items-center justify-center rounded-full transition-all duration-200 active:scale-95",
                  isSearchPage
                    ? "bg-muru-pink text-white shadow-lg shadow-muru-pink/15"
                    : "text-muru-text-secondary hover:text-muru-pink hover:bg-muru-pink-soft/60"
                )}
                aria-label="Search products"
              >
                <SearchIcon className="w-5 h-5" />
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="inline-flex items-center gap-1.5 h-[42px] px-3 rounded-full border border-muru-border/50 text-muru-text-secondary hover:text-muru-pink hover:border-muru-pink/30 transition-all duration-200 active:scale-95"
                  aria-label="Change language"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold">{languageLabels[language]}</span>
                </button>
                {langMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg border border-muru-border/30 overflow-hidden min-w-[140px]">
                      {Object.entries(languageLabels).map(([code, label]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setLanguage(code);
                            setLangMenuOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2 transition-colors",
                            language === code
                              ? "bg-muru-pink-soft/50 text-muru-pink"
                              : "text-muru-text-main hover:bg-muru-pink-soft/30"
                          )}
                        >
                          <span className="font-bold">{label}</span>
                          <span className="text-muru-text-secondary text-xs">({languageNames[code]})</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleTelegramClick}
                className="inline-flex items-center gap-2.5 h-[44px] px-6 bg-muru-pink hover:bg-muru-pink-dark text-white text-sm font-semibold rounded-full transition-all duration-200 active:scale-95 shadow-lg shadow-muru-pink/10"
                aria-label="Chat on Telegram"
              >
                <Send className="w-4 h-4" />
                <span>{t('nav.chatOnTelegram')}</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={cn(
        "fixed inset-0 z-[60] lg:hidden transition-[visibility] duration-300",
        mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
      )}>
        <div
          className={cn(
            "fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={cn(
          "relative h-full w-[86vw] max-w-[360px] bg-white flex flex-col border-r border-muru-border/20 shadow-2xl transition-transform duration-500 ease-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Drawer Header with Close Button */}
          <div className="flex items-center justify-between h-[72px] px-6 border-b border-muru-border/10">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 -ml-2 flex items-center justify-center text-muru-text-main hover:text-muru-pink transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-sm font-bold tracking-[0.22em] text-muru-text-main opacity-40">MENU</span>
            <div className="w-8" /> {/* Spacer */}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col space-y-8">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 transition-[opacity,transform] duration-500 ease-out",
                mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"
              )}
              style={{ transitionDelay: mobileMenuOpen ? '80ms' : '0ms' }}
              aria-label={`${brandName} home`}
            >
              {settings?.logo ? (
                <img src={settings.logo} alt={brandName} className="h-11 w-11 rounded-full object-contain" />
              ) : (
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muru-pink text-white shadow-lg shadow-muru-pink/20">
                  <span className="text-lg font-bold tracking-[0.12em]">M</span>
                </span>
              )}
              <div className="min-w-0">
                <span className="block truncate text-xl font-bold tracking-[0.18em] text-muru-text-main">
                  {brandName}
                </span>
                <span className="block truncate text-[13px] font-medium text-muru-text-secondary">
                  Simple skincare
                </span>
              </div>
            </Link>

            <nav className="flex flex-col">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "py-4 text-[18px] font-semibold border-b border-muru-border/10 last:border-0 transition-[color,opacity,transform] duration-500 ease-out",
                      mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0",
                      isActive
                        ? "text-muru-pink"
                        : "text-muru-text-main hover:text-muru-pink"
                    )}
                    style={{ transitionDelay: mobileMenuOpen ? `${150 + index * 60}ms` : '0ms' }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * Global MURU Footer
 * Compact premium footer with soft blush background.
 */
export const Footer = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const { t } = useLanguage();

  const telegramUrl = settings?.telegram_url || (settings?.telegram ? `https://t.me/${settings.telegram}` : 'https://t.me/muru_skincare');
  const instagramUrl = settings?.instagram || 'https://instagram.com/muru.skincare';
  const facebookUrl = settings?.facebook || 'https://facebook.com/muru.skincare';
  const tiktokUrl = settings?.tiktok || 'https://tiktok.com/@muru.skincare';

  const socialLinks = [
    { label: 'Telegram', href: telegramUrl, icon: Send },
    { label: 'Instagram', href: instagramUrl, icon: InstagramIcon },
    { label: 'Facebook', href: facebookUrl, icon: FacebookIcon },
    { label: 'TikTok', href: tiktokUrl, icon: TikTokIcon },
  ];

  return (
    <footer className="bg-[#FFF7F9] border-t border-muru-border/30 text-muru-text-main">
      <Container className="max-w-[1280px] py-14 md:py-16">
        {/* Desktop Layout (4 Columns) */}
        <div className="hidden md:grid grid-cols-12 gap-12 lg:gap-16">
          {/* Column 1: Brand */}
          <div className="col-span-5 space-y-4">
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-[0.22em] text-muru-text-main hover:text-muru-pink transition-colors"
            >
              MURU
            </Link>
            <p className="text-[15px] text-muru-text-secondary leading-relaxed max-w-[260px]">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="col-span-2 space-y-5">
            <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-muru-text-main">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-[15px] text-muru-text-secondary hover:text-muru-pink transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[15px] text-muru-text-secondary hover:text-muru-pink transition-colors">
                  {t('nav.products')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-2 space-y-5">
            <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-muru-text-main">
              {t('footer.company')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-[15px] text-muru-text-secondary hover:text-muru-pink transition-colors">
                  {t('nav.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[15px] text-muru-text-secondary hover:text-muru-pink transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="col-span-3 space-y-5">
            <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-muru-text-main">
              {t('footer.connect')}
            </h4>
            <ul className="space-y-3">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-muru-text-secondary hover:text-muru-pink transition-colors inline-flex items-center gap-3 group"
                  >
                    <span className="w-8 h-8 rounded-full bg-muru-pink flex items-center justify-center text-white transition-transform group-hover:scale-110">
                      <item.icon className="w-4 h-4" />
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center text-center">
          {/* Brand */}
          <div className="mb-10">
            <Link
              to="/"
              className="inline-block text-[28px] font-bold tracking-[0.22em] text-muru-text-main mb-3"
            >
              MURU
            </Link>
            <div className="flex items-center justify-center gap-5 mt-4">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muru-pink flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-muru-pink/20"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-muru-border/20 mb-8" />

          {/* Copyright & Policy */}
          <div className="space-y-3 text-[14px] text-muru-text-secondary font-medium">
            <p>{settings?.copyright_text || settings?.copyright || '© 2026 MURU. All rights reserved.'}</p>
            <Link to="/privacy" className="block text-muru-text-secondary hover:text-muru-pink transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
          </div>
        </div>

        {/* Bottom Bar (Desktop Only) */}
        <div className="hidden md:flex mt-14 pt-8 border-t border-muru-border/20 items-center justify-between text-[13px] text-muru-text-secondary font-medium">
          <p>{settings?.copyright_text || settings?.copyright || '© 2026 MURU. All rights reserved.'}</p>
          <Link to="/privacy" className="hover:text-muru-pink transition-colors">
            {t('footer.privacyPolicy')}
          </Link>
        </div>
      </Container>
    </footer>
  );
};
