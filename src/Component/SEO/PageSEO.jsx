import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://stiknex.vercel.app";
const SITE_NAME = "Stiknex";
const DEFAULT_IMAGE = `${SITE_URL}/Stiknex.png`;

const buildBreadcrumbSchema = (path, title) => {
  const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }];
  if (path !== "/") {
    crumbs.push({
      "@type": "ListItem",
      position: 2,
      name: title,
      item: `${SITE_URL}${path}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs,
  };
};

const PageSEO = ({ title, description, path = "/", image, noIndex = false, type = "website", datePublished, keywords, faqs }) => {
  const [dynamicKeywords, setDynamicKeywords] = useState(keywords || "");
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // Dynamically inject the most relevant trending keywords into meta keywords
    const fetchKeywords = async () => {
      try {
        const res = await fetch("/api/latest-keywords");
        if (res.ok) {
          const json = await res.json();
          if (json.keywords && json.keywords.length > 0) {
            const combined = [...new Set([
              ...(keywords ? keywords.split(",").map(k => k.trim()) : []),
              ...json.keywords
            ])].join(", ");
            setDynamicKeywords(combined);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic keywords for SEO");
      }
    };
    fetchKeywords();
  }, [keywords]);

  const breadcrumbSchema = buildBreadcrumbSchema(path, title);

  let mainSchema = null;
  if (type === "article") {
    mainSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      image: ogImage,
      datePublished: datePublished || new Date().toISOString(),
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: DEFAULT_IMAGE } },
      description: description
    };
  } else if (type === "webapp") {
    mainSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: url,
      description: description,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0" }
    };
  } else {
    mainSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  }

  let faqSchema = null;
  if (faqs && faqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    };
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={dynamicKeywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {mainSchema && (
        <script type="application/ld+json">
          {JSON.stringify(mainSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default PageSEO;
