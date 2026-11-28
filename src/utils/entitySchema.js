export const SITE_URL = "https://stiknex.site";
export const SITE_NAME = "Stiknex";
export const LOGO_URL = `${SITE_URL}/Stiknex.png`;

export const FOUNDER_SAME_AS = [
  "https://github.com/vishalmall8419",
  "https://www.linkedin.com/in/vishal-mall-536506302/",
  "https://x.com/MrVishalMa24207",
];

export const FOUNDER_PROFILE_LINKS = [
  { label: "GitHub", url: "https://github.com/vishalmall8419" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/vishal-mall-536506302/" },
  { label: "X", url: "https://x.com/MrVishalMa24207" },
];

export function buildPersonSchema() {
  return {
    "@type": "Person",
    name: "Vishal Mall",
    url: `${SITE_URL}/about`,
    sameAs: FOUNDER_SAME_AS,
  };
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    founder: buildPersonSchema(),
    sameAs: FOUNDER_SAME_AS,
  };
}

export function buildWebSiteSchema(description) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    ...(description ? { description } : {}),
    author: buildPersonSchema(),
    publisher: buildOrganizationSchema(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
