import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowRight } from 'lucide-react';
import { Container } from '../../components/Layout';
import Reveal from '../../components/Reveal';
import { pageService } from '../../api/services/pageService';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const About = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const { t } = useLanguage();

  const telegramUrl = settings?.telegram_url || (settings?.telegram ? `https://t.me/${settings.telegram}` : 'https://t.me/muru_skincare');

  useEffect(() => {
    let isMounted = true;
    pageService
      .getAbout()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load About data', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTelegramClick = () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-16">
        <Container>
          <div className="animate-pulse space-y-8 max-w-3xl mx-auto text-center">
            <div className="h-4 bg-muru-pink-soft/50 rounded w-32 mx-auto" />
            <div className="h-10 bg-muru-pink-soft/50 rounded w-3/4 mx-auto" />
            <div className="h-20 bg-muru-pink-soft/30 rounded w-full" />
            <div className="h-96 bg-muru-pink-soft/40 rounded-[1.75rem] w-full" />
          </div>
        </Container>
      </div>
    );
  }

  if (!data) return null;

  const { hero, story: ourStory, quality, cta } = data;

  return (
    <main className="bg-white min-h-screen">
      <SEO
        title="About Us"
        description={hero?.description || 'Learn about MURU skincare, our mission, and our commitment to natural beauty.'}
        slug="about"
      />

      {/* HERO */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal as="header" className="max-w-3xl mx-auto text-center space-y-6 mb-14 md:mb-20" direction="up">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muru-pink">
              {hero?.label || t('about.heroLabel')}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-muru-text-main">
              {hero?.title || t('about.heroTitle')}
            </h1>
            <p className="text-muru-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {hero?.description}
            </p>
          </Reveal>

          <Reveal className="aspect-[16/9] rounded-[1.75rem] overflow-hidden shadow-soft bg-muru-pink-soft/40" delay={120}>
            <img
              src={hero?.image || '/images/muru_about_quality_1788772489240.jpg'}
              alt={hero?.title || 'MURU Skincare'}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </Reveal>
        </Container>
      </section>

      {/* OUR STORY */}
      <section className="py-20 md:py-28 border-t border-muru-border/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <Reveal className="rounded-[1.75rem] overflow-hidden shadow-soft bg-muru-pink-soft/40">
              <img
                src={ourStory?.image || '/images/muru_brand_story_1788771976448.jpg'}
                alt={ourStory?.title || 'Our Story'}
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </Reveal>

            <Reveal as="article" className="space-y-6 max-w-xl" direction="right" delay={120}>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muru-pink">{t('about.journey')}</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-muru-text-main">
                {ourStory?.title}
              </h2>
              <p className="text-muru-text-secondary text-base sm:text-lg leading-relaxed">
                {ourStory?.content}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* QUALITY */}
      <section className="py-20 md:py-28 border-t border-muru-border/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <Reveal as="article" className="space-y-6 max-w-xl order-2 lg:order-1">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muru-pink">{t('about.standards')}</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-muru-text-main">
                {quality?.title}
              </h2>
              <p className="text-muru-text-secondary text-base sm:text-lg leading-relaxed">
                {quality?.description}
              </p>
            </Reveal>

            <Reveal className="rounded-[1.75rem] overflow-hidden shadow-soft bg-muru-pink-soft/40 order-1 lg:order-2" direction="right" delay={120}>
              <img
                src={quality?.image || '/images/muru_about_quality_1788772489240.jpg'}
                alt={quality?.title || 'Quality Standards'}
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-muru-pink-soft/60 border-t border-muru-border/40">
        <Container>
          <Reveal className="max-w-2xl mx-auto text-center space-y-8" direction="up">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-muru-text-main">
              {cta?.heading || t('about.discoverTitle')}
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 bg-muru-pink hover:bg-muru-pink-dark text-white font-medium text-[15px] rounded-full transition-colors duration-200 active:scale-95"
              >
                <span>{cta?.explore_button || t('about.exploreButton')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleTelegramClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 bg-white hover:bg-muru-pink-blush text-muru-text-main hover:text-muru-pink font-medium text-[15px] rounded-full border border-muru-border transition-colors duration-200 active:scale-95"
              >
                <Send className="w-4 h-4 text-muru-pink" />
                <span>{cta?.telegram_button || t('about.telegramButton')}</span>
              </button>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
};

export default About;
