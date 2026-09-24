import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`PAGE LOG: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  try {
    await page.goto("http://localhost:5174/whiteboard", { waitUntil: "networkidle2", timeout: 10000 });
    
    // Inject corrupted legacy data
    await page.evaluate(() => {
      localStorage.setItem("whiteboards", JSON.stringify([{
        id: "wb_legacy",
        title: "Legacy Drawing",
        elements: [{ x: 10, y: 10, w: 100, h: 100 }], // No id, no type
        appState: { customLegacyState: true, activeTool: "random" },
        createdAt: 123456789,
        updatedAt: 123456789
      }]));
    });
    
    // Reload to apply local storage
    await page.reload({ waitUntil: "networkidle2" });
    
    // Click the legacy drawing
    await page.evaluate(() => {
      const card = document.querySelector('.grid > div');
      if (card) card.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log("Check for errors above.");
    
  } catch (err) {
    console.error("Script error:", err);
  }
  
  await browser.close();
})();
