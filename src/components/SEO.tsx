import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  googleVerification?: string;
}

export default function SEO({ 
  title = "Trazot | The Elite Marketplace", 
  description = "Trazot is a high-security, verified marketplace for premium items. Buy and sell with total confidence.",
  keywords = "marketplace, sell items, buy items, verified sellers, premium ads",
  image = "https://trazot.com/og-image.jpg",
  url = "https://trazot.com",
  type = "website",
  googleVerification = ""
}: SEOProps) {
  const siteTitle = title.includes("Trazot") ? title : `${title} | Trazot`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {googleVerification && <meta name="google-site-verification" content={googleVerification} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
