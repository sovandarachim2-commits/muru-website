import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Leaf, Send, Sparkles } from 'lucide-react';
import { Container } from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import Reveal from '../../components/Reveal';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { homepageService } from '../../api/services/homepageService';
import { productService } from '../../api/services/productService';
import SEO from '../../components/SEO';

const FALLBACK_SECTIONS = {
  hero: {
    title: 'Pure Care.',
    subtitle: 'Real Results.',
    content: 'Simple skincare for your everyday glow.',
    image: '/images/muru_hero_campaign_1788771956720.jpg',
    button_text: 'Explore Products',
    button_link: '/products',
    extra_data: { label: 'MURU SKINCARE' },
  },
  signature_products: {
    title: 'Our Products',
    subtitle: 'Discover MURU skincare essentials.',
  },
  brand_story: {
    title: 'Healthy Skin,\nHappier You',
    content: 'At MURU, we believe skincare should be simple, safe, and effective. Our products are carefully formulated to bring out your natural beauty, because healthy skin makes a happier you.',
    image: '/images/muru_brand_story_1788771976448.jpg',
    button_text: 'Our Story',
    button_link: '/about',
  },
  telegram_cta: {
    title: 'Questions about MURU products?',
    content: 'Chat directly with our team on Telegram.',
    button_text: 'Chat on Telegram',
    image: '/images/muru_about_quality_1788772489240.jpg',
  },
};

const getBenefitItems = (t) => [
  { label: t('benefits.gentleFormulas'), icon: Leaf },
  { label: t('benefits.visibleResults'), icon: Sparkles },
  { label: t('benefits.everydayCare'), icon: Heart },
];

const getResponseList = (response) => {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
};

const titleLines = (title, fallback) => (title || fallback).split('\n');

const Home = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [sections, setSections] = useState(FALLBACK_SECTIONS);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const benefitItems = getBenefitItems(t);

  useEffect(() => {
    let isMounted = true;

    const fetchHome = async () => {
      try {
        const [homeResponse, productResponse] = await Promise.all([
          homepageService.getData(),
          productService.getAll({ featured: true, per_page: 4 }),
        ]);

        if (!isMounted) return;

        const byKey = {};
        getResponseList(homeResponse).forEach((section) => {
          byKey[section.section_key] = section;
        });
        setSections((prev) => ({ ...prev, ...byKey }));

        setFeaturedProducts(getResponseList(productResponse).slice(0, 4));
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    fetchHome();
    return () => {
      isMounted = false;
    };
  }, []);

  const hero = sections.hero || FALLBACK_SECTIONS.hero;
  const signature = sections.signature_products || FALLBACK_SECTIONS.signature_products;
  const story = sections.brand_story || FALLBACK_SECTIONS.brand_story;
  const cta = sections.telegram_cta || FALLBACK_SECTIONS.telegram_cta;

  const telegramUrl = useMemo(
    () => settings?.telegram_url || (settings?.telegram ? `https://t.me/${settings.telegram}` : 'https://t.me/muru_skincare'),
    [settings]
  );

  const handleTelegramClick = () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="bg-white">
      <SEO
        title="Home"
        description={hero?.content || FALLBACK_SECTIONS.hero.content}
      />

      <section className="overflow-hidden bg-linear-to-br from-white via-white to-muru-pink-soft/60">
        <Container className="max-w-[1280px]">
          <div className="grid min-h-[calc(100svh-72px)] items-center gap-10 py-10 sm:py-14 lg:min-h-[600px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-0">
            <Reveal as="article" className="max-w-xl space-y-6 lg:space-y-7">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muru-pink sm:text-sm">
                {hero?.extra_data?.label || t('hero.label')}
              </p>

              <h1 className="text-[clamp(2.25rem,11vw,4rem)] font-bold leading-[1.05] tracking-tight text-muru-text-main lg:text-[64px]">
                {titleLines(hero?.title, FALLBACK_SECTIONS.hero.title).map((line) => (
                  <React.Fragment key={line}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
                {hero?.subtitle && <span>{hero.subtitle}</span>}
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-muru-text-secondary sm:text-lg">
                {hero?.content || FALLBACK_SECTIONS.hero.content}
              </p>

              <Link
                to={hero?.button_link || '/products'}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-muru-pink px-8 text-[15px] font-semibold text-white shadow-lg shadow-muru-pink/20 transition-colors duration-200 hover:bg-muru-pink-dark active:scale-95"
              >
                <span>{hero?.button_text || t('hero.buttonText')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="grid max-w-md grid-cols-3 gap-3 pt-3 sm:gap-5 sm:pt-5">
                {benefitItems.map(({ label, icon: Icon }) => (
                  <div key={label} className="space-y-2 text-center">
                    <Icon className="mx-auto h-6 w-6 text-muru-pink" strokeWidth={1.8} />
                    <p className="text-xs font-medium leading-snug text-muru-text-secondary sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="relative mx-auto w-full max-w-[620px] lg:max-w-none" direction="right" delay={120}>
              <div className="absolute inset-6 rounded-full bg-muru-pink-blush/60 blur-3xl" />
              <div className="relative overflow-hidden rounded-[28px] bg-white/50 shadow-soft">
                <img
                  src={hero?.image || FALLBACK_SECTIONS.hero.image}
                  alt={hero?.title || 'MURU skincare products'}
                  className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                  loading="eager"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-muru-border/40 bg-white py-14 md:py-20 lg:py-24">
        <Container className="max-w-[1280px]">
          <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-12">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muru-pink sm:text-sm">{t('featuredProducts.label')}</p>
              <h2 className="text-3xl font-bold tracking-tight text-muru-text-main sm:text-4xl">
                {signature?.title || t('featuredProducts.title')}
              </h2>
              <p className="max-w-lg text-muru-text-secondary">
                {signature?.subtitle || t('featuredProducts.subtitle')}
              </p>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-muru-pink transition-colors hover:text-muru-pink-dark sm:inline-flex"
            >
              {t('featuredProducts.viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {loadingProducts ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="aspect-square rounded-[20px] bg-muru-pink-soft/60" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-muru-pink-soft/70" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muru-pink-soft/50" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 4) * 70} direction="up">
                  <ProductCard product={product} showDescription />
                </Reveal>
              ))}
            </div>
          ) : null}

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muru-pink"
            >
              {t('featuredProducts.viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-muru-border/40 bg-linear-to-br from-white to-muru-pink-soft/35 py-14 md:py-20 lg:py-0">
        <Container className="max-w-[1280px]">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="overflow-hidden rounded-[28px] bg-muru-pink-soft/40 shadow-soft">
              <img
                src={story?.image || FALLBACK_SECTIONS.brand_story.image}
                alt={story?.title || 'MURU brand story'}
                className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                loading="lazy"
              />
            </Reveal>

            <Reveal as="article" className="max-w-xl space-y-6 lg:py-24" direction="right" delay={120}>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-muru-pink sm:text-sm">{t('brandStory.label')}</p>
              <h2 className="whitespace-pre-line text-3xl font-bold leading-tight tracking-tight text-muru-text-main sm:text-4xl lg:text-5xl">
                {story?.title || t('brandStory.title')}
              </h2>
              <p className="text-base leading-relaxed text-muru-text-secondary sm:text-lg">
                {story?.content || t('brandStory.content')}
              </p>
              <Link
                to={story?.button_link || '/about'}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-muru-pink px-8 text-[15px] font-semibold text-white shadow-lg shadow-muru-pink/20 transition-colors duration-200 hover:bg-muru-pink-dark active:scale-95"
              >
                <span>{story?.button_text || t('brandStory.buttonText')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-muru-pink-soft py-12 md:py-16">
        <Container className="max-w-[1280px]">
          <Reveal className="grid items-center gap-8 md:grid-cols-[1fr_0.9fr] md:gap-12" direction="up">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="mx-auto max-w-sm text-2xl font-bold leading-tight tracking-tight text-muru-text-main sm:text-3xl md:mx-0">
                {cta?.title || t('telegramCta.title')}
              </h2>
              <p className="text-sm text-muru-text-secondary sm:text-base">
                {cta?.content || t('telegramCta.content')}
              </p>
              <button
                type="button"
                onClick={handleTelegramClick}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-muru-pink px-8 text-[15px] font-semibold text-white shadow-lg shadow-muru-pink/20 transition-colors duration-200 hover:bg-muru-pink-dark active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>{cta?.button_text || t('telegramCta.buttonText')}</span>
              </button>
            </div>

            <div className="hidden overflow-hidden rounded-[26px] bg-white/45 shadow-soft md:block">
              <img
                src={cta?.image || FALLBACK_SECTIONS.telegram_cta.image}
                alt="MURU skincare support"
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
};

export default Home;
