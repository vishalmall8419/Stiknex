import { useEffect } from "react";

const DynamicSEO = () => {
  useEffect(() => {
    const updateMetaTags = async () => {
      try {
        const res = await fetch('/api/get-trends');
        const json = await res.json();
        
        if (json.success && json.data) {
          // Sort by highest traffic (trendScore) and relevance
          const seoTrends = json.data
            .filter(t => t.status !== 'ignored')
            .sort((a, b) => {
              if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
              return (b.trendScore || 0) - (a.trendScore || 0);
            })
            .slice(0, 100) // User specifically requested 100 keywords
            .map(t => t.keyword);
            
          if (seoTrends.length > 0) {
            const keywordsString = seoTrends.join(', ');
            
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
              const currentContent = metaKeywords.getAttribute('content');
              if (!currentContent.includes(seoTrends[0])) {
                 // Auto inject 100 keywords
                 metaKeywords.setAttribute('content', keywordsString + ', ' + currentContent);
              }
            }

            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                const currentDesc = metaDescription.getAttribute('content');
                if (!currentDesc.includes("Live Trends:")) {
                   // Inject top 10 into description (100 is too big for description)
                   const descTrends = seoTrends.slice(0, 15).join(', ');
                   metaDescription.setAttribute('content', currentDesc + " Live Trends: " + descTrends + ".");
                }
            }
            console.log("Auto-Injected 100 Keywords into Meta Tags");
          }
        }
      } catch (err) {
        console.error("Failed to update dynamic SEO:", err);
      }
    };
    
    updateMetaTags();
  }, []);

  return null;
};

export default DynamicSEO;
