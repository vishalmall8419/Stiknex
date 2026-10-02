import { useEffect } from "react";

const SITE_URL = "https://stiknex.vercel.app";
const SITE_NAME = "Stiknex";
const DEFAULT_IMAGE = `${SITE_URL}/Stiknex.png`;

const setMetaByName = (name, content) => {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setMetaByProperty = (property, content) => {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setCanonical = (href) => {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const setJsonLd = (id, data) => {
  let script = document.getElementById(id);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

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
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const ogImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    setMetaByName("title", fullTitle);
    setMetaByName("description", description);
    if (keywords) setMetaByName("keywords", keywords);
    setMetaByName("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    setCanonical(url);

    setMetaByProperty("og:type", type === "article" ? "article" : "website");
    setMetaByProperty("og:title", fullTitle);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", url);
    setMetaByProperty("og:site_name", SITE_NAME);
    setMetaByProperty("og:image", ogImage);

    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", fullTitle);
    setMetaByName("twitter:description", description);
    setMetaByName("twitter:image", ogImage);

    // 1. Breadcrumb Schema
    setJsonLd("page-breadcrumb-schema", buildBreadcrumbSchema(path, title));

    // 2. Article / WebApp / Website Schema
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
    setJsonLd("page-main-schema", mainSchema);

    // 3. FAQ Schema
    if (faqs && faqs.length > 0) {
      setJsonLd("page-faq-schema", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      });
    }

    return () => {
      setJsonLd("page-breadcrumb-schema", null);
      setJsonLd("page-main-schema", null);
      setJsonLd("page-faq-schema", null);
    };
  }, [title, description, path, image, noIndex, type, datePublished, keywords, faqs]);

  return null;
};

export default PageSEO;
