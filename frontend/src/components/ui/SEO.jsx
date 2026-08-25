import { useEffect } from 'react';

const APP_URL = import.meta.env.VITE_APP_URL || '';

export function SEO({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const siteName = 'CEO Foundation';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const canonical = `${APP_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image || `${APP_URL}/favicon.svg`;

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return (
    <>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </>
  );
}

export default SEO;
