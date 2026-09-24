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

const PageSEO = ({ title, description, path = "/", image, noIndex = false }) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const ogImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    setMetaByName("title", fullTitle);
    setMetaByName("description", description);
    setMetaByName("robots", noIndex ? "noindex, nofollow" : "index, follow");

    setCanonical(url);

    setMetaByProperty("og:type", "website");
    setMetaByProperty("og:title", fullTitle);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", url);
    setMetaByProperty("og:site_name", SITE_NAME);
    setMetaByProperty("og:image", ogImage);

    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", fullTitle);
    setMetaByName("twitter:description", description);
    setMetaByName("twitter:image", ogImage);

    setJsonLd("page-breadcrumb-schema", buildBreadcrumbSchema(path, title));

    return () => {
      setJsonLd("page-breadcrumb-schema", null);
    };
  }, [title, description, path, image, noIndex]);

  return null;
};

export default PageSEO;
