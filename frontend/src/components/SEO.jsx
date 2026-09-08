import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

/**
 * Reusable SEO Component
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @param {string} image - OG image URL
 * @param {string} slug - Page slug for canonical URL
 * @param {boolean} product - Whether this is a product page
 */
const SEO = ({ title, description, image, slug = '', product = false }) => {
  const { settings } = useSettings();

  const siteName = settings?.site_name || 'MURU';
  const defaultTitle = settings?.default_title || 'MURU | Premium Skincare';
  const defaultDesc = settings?.default_meta_description || 'Simple skincare for your everyday glow. Premium cosmetics for natural beauty.';
  const siteUrl = settings?.website_url || window.location.origin;
  const ogImage = image || settings?.social_sharing_image || `${siteUrl}/images/og-image.jpg`;

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDesc = description || defaultDesc;
  const canonicalUrl = `${siteUrl}${slug ? `/${slug}` : ''}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={product ? 'product' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta charSet="UTF-8" />
    </Helmet>
  );
};

export default SEO;
