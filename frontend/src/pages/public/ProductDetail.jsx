import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Check, ChevronRight } from 'lucide-react';
import { Container } from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import Reveal from '../../components/Reveal';
import { productService } from '../../api/services/productService';
import { useSettings } from '../../context/SettingsContext';
import { cn } from '../../api/utils';
import SEO from '../../components/SEO';

const ProductDetail = () => {
  const { slug } = useParams();
  const { settings } = useSettings();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([productService.getBySlug(slug), productService.getRelated(slug)])
      .then(([prodRes, relatedRes]) => {
        if (isMounted) {
          const productData = prodRes.data.data || prodRes.data;
          const relatedData = relatedRes.data.data || relatedRes.data;
          setProduct(productData);
          setRelatedProducts(relatedData || []);
          setSelectedImage(productData.images?.[0] || productData.image || '/images/muru_hero_campaign_1788771956720.jpg');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load product detail', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleAskOnTelegram = () => {
    const rawTelegramUrl = settings?.telegram_url || (settings?.telegram ? `https://t.me/${settings.telegram}` : 'https://t.me/muru_skincare');
    const productName = product?.name || 'MURU Product';
    const productUrl = window.location.href;
    const prefilledText = `Hello MURU, I'm interested in:\n\n${productName}\n\nProduct:\n${productUrl}\n\nCould you please give me more information?`;
    const separator = rawTelegramUrl.includes('?') ? '&' : '?';
    window.open(`${rawTelegramUrl}${separator}text=${encodeURIComponent(prefilledText)}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-12 md:py-16">
        <Container>
          <div className="h-4 bg-muru-pink-soft/40 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="aspect-square bg-muru-pink-soft/40 rounded-[1.75rem] animate-pulse" />
            <div className="space-y-4">
              <div className="h-3 bg-muru-pink-soft/60 rounded w-32 animate-pulse" />
              <div className="h-9 bg-muru-pink-soft/50 rounded w-3/4 animate-pulse" />
              <div className="h-5 bg-muru-pink-soft/40 rounded w-1/2 animate-pulse" />
              <div className="h-6 bg-muru-pink-soft/50 rounded w-1/4 animate-pulse" />
              <div className="h-20 bg-muru-pink-soft/30 rounded w-full animate-pulse" />
              <div className="h-12 bg-muru-pink/20 rounded-full w-2/3 animate-pulse" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen py-20">
        <SEO title="Product Not Found" description="The requested skincare product could not be found." />
        <Container className="text-center">
          <h2 className="text-2xl font-semibold text-muru-text-main mb-4">Product Not Found</h2>
          <p className="text-muru-text-secondary mb-6">The requested skincare product could not be found.</p>
          <Link to="/products" className="inline-flex items-center h-11 px-7 bg-muru-pink hover:bg-muru-pink-dark text-white font-medium text-sm rounded-full transition-colors">
            Back to Products
          </Link>
        </Container>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image || '/images/muru_hero_campaign_1788771956720.jpg'];

  const benefitsList = product.benefits && product.benefits.length > 0
    ? product.benefits
    : [
        'Dermatologically tested for all skin types',
        'Sustainably sourced natural ingredients',
        'Deep hydration without heavy greasy feel',
        'Paraben-free, sulphate-free & cruelty-free',
      ];

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'how_to_use', label: 'How to Use' },
    { id: 'ingredients', label: 'Ingredients' },
  ];

  return (
    <main className="bg-white min-h-screen py-10 md:py-16">
      <SEO
        title={product.name}
        description={product.seo_description || product.short_description || product.description}
        image={selectedImage}
        slug={`products/${product.slug}`}
        product={true}
      />
      <Container>
        <Reveal as="nav" className="flex items-center gap-2 text-sm text-muru-text-secondary mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-muru-pink transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-muru-border" />
          <Link to="/products" className="hover:text-muru-pink transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-muru-border" />
          <span className="text-muru-text-main font-medium truncate max-w-xs sm:max-w-md" aria-current="page">
            {product.name}
          </span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16 md:mb-24">
          <Reveal as="section" className="space-y-4 lg:sticky lg:top-28">
            <div className="aspect-square rounded-[1.75rem] overflow-hidden bg-muru-pink-soft/40 shadow-soft">
              <img
                src={selectedImage || galleryImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={cn(
                      'w-20 h-20 rounded-2xl overflow-hidden bg-muru-pink-soft/40 transition-all flex-shrink-0',
                      selectedImage === imgUrl
                        ? 'ring-2 ring-muru-pink'
                        : 'opacity-70 hover:opacity-100'
                    )}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal as="article" className="space-y-6" direction="right" delay={120}>
            <header>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muru-pink">MURU Skincare</p>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-semibold tracking-tight text-muru-text-main mt-2">
                {product.name}
              </h1>
              {(product.tagline || product.subtitle) && (
                <p className="text-base text-muru-text-secondary mt-2">
                  {product.tagline || product.subtitle}
                </p>
              )}
              {product.formatted_price && (
                <p className="text-2xl font-medium text-muru-text-main mt-4">{product.formatted_price}</p>
              )}
            </header>

            <p className="text-muru-text-secondary text-base leading-relaxed border-t border-muru-border/40 pt-6">
              {product.short_description || product.description}
            </p>

            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muru-text-main">Key Benefits</h3>
              <ul className="space-y-2.5">
                {benefitsList.slice(0, 5).map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muru-text-main">
                    <Check className="w-4 h-4 text-muru-pink flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-6 border-t border-muru-border/40 space-y-3">
              <button
                type="button"
                onClick={handleAskOnTelegram}
                className="inline-flex items-center justify-center gap-2.5 h-12 px-8 bg-muru-pink hover:bg-muru-pink-dark text-white font-medium text-[15px] rounded-full transition-colors duration-200 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Ask About This Product</span>
              </button>
              <p className="text-xs text-muru-text-secondary">Clicking opens Telegram with your prefilled product inquiry.</p>
            </div>
          </Reveal>
        </div>

        <Reveal as="section" className="pt-10 border-t border-muru-border/40 mb-16 md:mb-24" direction="up">
          <div className="flex items-center gap-8 border-b border-muru-border/40 overflow-x-auto mb-8" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px',
                  activeTab === tab.id
                    ? 'border-muru-pink text-muru-pink'
                    : 'border-transparent text-muru-text-secondary hover:text-muru-text-main'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-3xl text-muru-text-secondary leading-relaxed text-base" role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>{product.description || product.short_description}</p>
                <p>
                  Every MURU product is thoughtfully engineered to preserve skin purity and essential moisture balance.
                  Gentle on all skin types, including sensitive skin.
                </p>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-3">
                <p className="text-muru-text-main font-medium">Why your skin will love this product:</p>
                <ul className="space-y-3">
                  {benefitsList.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muru-text-main">
                      <Check className="w-4 h-4 text-muru-pink flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'how_to_use' && (
              <div className="space-y-4">
                <p className="text-muru-text-main font-medium">Recommended Application:</p>
                <p>
                  {product.how_to_use || 'Dispense appropriate amount onto clean fingertips or cotton pad. Gently pat into clean face and neck until fully absorbed. Suitable for daily morning and evening use.'}
                </p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <p className="text-muru-text-main font-medium">Full Ingredients List:</p>
                <p className="text-sm leading-relaxed">
                  {product.ingredients || 'Aqua, Glycerin, Rosa Damascena Flower Water, Aloe Barbadensis Leaf Juice, Niacinamide, Sodium Hyaluronate, Panthenol, Phenoxyethanol, Ethylhexylglycerin.'}
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {relatedProducts.length > 0 && (
          <Reveal as="section" className="pt-12 border-t border-muru-border/40" direction="up">
            <header className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-muru-text-main">You May Also Like</h2>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {relatedProducts.slice(0, 4).map((relProd, idx) => (
                <Reveal key={relProd.id} delay={idx * 70} direction="up">
                  <ProductCard product={relProd} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </main>
  );
};

export default ProductDetail;
