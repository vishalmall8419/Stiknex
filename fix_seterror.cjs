const fs = require('fs');
const files = ['src/Pages/Admin2/AnalyticsPage.jsx', 'src/Pages/Admin2/DashBoard.jsx'];
for (let f of files) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(
    "if (json.success) { setData(json.data); setError(null); } else { setError(json.error || json.message || 'Failed'); }",
    "if (json.success) { setData(json.data); } else { alert('Google Analytics Error: ' + (json.error || json.message)); }"
  );
  fs.writeFileSync(f, c);
}
console.log('Fixed setError bug!');
