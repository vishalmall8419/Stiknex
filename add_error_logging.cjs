const fs = require('fs');
const files = ['src/Pages/Admin2/AnalyticsPage.jsx', 'src/Pages/Admin2/DashBoard.jsx'];

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    'if (json.success) setData(json.data);',
    if (json.success) {
            setData(json.data);
          } else {
            console.error("API Error:", json.error || json.message);
            alert("Google Analytics API Error: " + (json.error || json.message) + "\\n\\nPlease make sure your Service Account Email is added as a 'Viewer' to your GA4 Property.");
          }
  );
  fs.writeFileSync(file, content);
}
console.log('Added error handling to UI');
