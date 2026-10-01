import connectToDatabase from './_utils/db.js';
import Trend from './_models/Trend.js';

export default async function handler(req, res) {
  try {
    const geo = req.query.geo || 'IN';
    
    // We fetch data for the last 30 days
    const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await connectToDatabase();

    const trends = await Trend.find({ date: { $gte: startTime } }).sort({ date: -1 });

    const relevantTrends = trends.filter(t => t.status === 'relevant' || t.status === 'used');
    let totalTraffic = 0;
    trends.forEach(t => {
      let tval = t.traffic.toString().replace(/[^0-9]/g, '');
      if (tval) totalTraffic += parseInt(tval);
    });
    
    const avgScore = trends.length > 0 ? Math.floor(trends.reduce((sum, t) => sum + (t.trendScore || 0), 0) / trends.length) : 0;
    
    const dateMap = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateMap[d] = { date: d, pending: 0, relevant: 0, used: 0 };
    }
    
    trends.forEach(t => {
        const d = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dateMap[d]) {
            if (t.status === 'relevant') dateMap[d].relevant += 1;
            else if (t.status === 'pending') dateMap[d].pending += 1;
            else if (t.status === 'used') dateMap[d].used += 1;
        }
    });
    const timeData = Object.values(dateMap);

    const formatK = (num) => num > 1000 ? (num/1000).toFixed(1) + 'K' : num.toString();

    const kpis = [
      { title: "Total Trends Found", value: trends.length.toString(), change: "Active", color: "#f97316" },
      { title: "Total Est. Traffic", value: formatK(totalTraffic), change: "Global", color: "#10b981" },
      { title: "Relevant Keywords", value: relevantTrends.length.toString(), change: "SEO", color: "#8b5cf6" },
      { title: "Keywords Used", value: trends.filter(t=>t.status==='used').length.toString(), change: "Content", color: "#ec4899" },
      { title: "Avg. Trend Score", value: avgScore.toString(), change: "Score", color: "#3b82f6" },
      { title: "Database Health", value: "100%", change: "Live", color: "#10b981" }
    ];

    const topKeywords = trends
        .sort((a,b) => b.trendScore - a.trendScore)
        .slice(0, 5)
        .map(t => ({ kw: t.keyword, score: t.trendScore, traffic: t.traffic }));

    const responseData = {
        success: true,
        data: {
            searchInterestData: timeData,
            topStates: topKeywords.map((k) => ({ state: k.kw, score: k.score })),
            relatedQueries: topKeywords.map((k) => ({ query: k.kw, growth: k.traffic })),
            kpis
        }
    };
    
    return res.status(200).json(responseData);

  } catch (err) {
    console.error("Trends Dashboard Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
