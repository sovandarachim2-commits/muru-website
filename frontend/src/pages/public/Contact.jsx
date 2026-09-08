import React from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from '../../components/BrandIcons';
import { Container } from '../../components/Layout';
import Reveal from '../../components/Reveal';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const ContactItem = ({ icon: Icon, label, value, description, action }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-semibold uppercase tracking-widest text-muru-pink flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </p>
    <p className="text-xl sm:text-2xl font-medium text-muru-text-main break-words">{value}</p>
    {description && <p className="text-sm text-muru-text-secondary">{description}</p>}
    {action && <div className="pt-3">{action}</div>}
  </div>
);

const Contact = () => {
  const { settings, loading } = useSettings();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muru-pink font-medium tracking-[0.2em] uppercase">MURU</div>
      </div>
    );
  }

  const handleTelegramClick = () => {
    const url = settings?.telegram_url || (settings?.telegram ? `https://t.me/${settings.telegram}` : 'https://t.me/muru_skincare');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const socialLinks = [
    { icon: InstagramIcon, url: settings?.instagram, label: 'Instagram' },
    { icon: FacebookIcon, url: settings?.facebook, label: 'Facebook' },
    { icon: TikTokIcon, url: settings?.tiktok, label: 'TikTok' },
  ].filter((link) => link.url);

  return (
    <main className="bg-white min-h-screen">
      <SEO
        title="Contact Us"
        description="Get in touch with the MURU skincare team. We are here to help you with any questions about our products."
        slug="contact"
      />

      {/* HERO */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal as="header" className="max-w-3xl mx-auto text-center space-y-6" direction="up">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muru-pink">{t('contact.heroLabel')}</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight text-muru-text-main">
              {t('contact.heroTitle')}
            </h1>
            <p className="text-muru-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {t('contact.heroDescription')}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* CONTACT METHODS */}
      <section className="py-16 md:py-24 bg-muru-pink-soft/60 border-t border-muru-border/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <Reveal className="space-y-10">
              <ContactItem
                icon={Send}
                label="Telegram"
                value={settings?.telegram || '@muru_skincare'}
                description="Chat directly with our team for instant support."
                action={
                  <button
                    onClick={handleTelegramClick}
                    className="inline-flex items-center justify-center gap-2.5 h-12 px-8 bg-muru-pink hover:bg-muru-pink-dark text-white font-medium text-[15px] rounded-full transition-colors duration-200 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('contact.chatOnTelegram')}</span>
                  </button>
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ContactItem icon={Phone} label={t('contact.phone')} value={settings?.phone || '+855 000 000 00'} />
                <ContactItem icon={Mail} label={t('contact.email')} value={settings?.email || 'hello@muru.com'} />
              </div>

              <ContactItem
                icon={MapPin}
                label={t('contact.location')}
                value="Phnom Penh, Cambodia"
                description={settings?.address}
              />

              {socialLinks.length > 0 && (
                <div className="pt-4 border-t border-muru-border/40">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muru-text-secondary mb-5">{t('contact.followUs')}</p>
                  <div className="flex items-center gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-white text-muru-text-main hover:bg-muru-pink hover:text-white transition-colors flex items-center justify-center"
                        aria-label={`Follow us on ${social.label}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal className="relative" direction="right" delay={120}>
              <div className="absolute -inset-6 lg:-inset-10 bg-muru-pink-soft/80 rounded-full blur-3xl pointer-events-none" />
              <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden shadow-soft">
                <img
                  src="/images/muru_about_quality_1788772489240.jpg"
                  alt="MURU Skincare Consultation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default Contact;
