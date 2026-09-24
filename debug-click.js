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
    
    // Create a new drawing to ensure we have one
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('New Drawing'));
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Go back to dashboard
    await page.evaluate(() => {
      const btn = document.querySelector('.fa-arrow-left').closest('button');
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Click the drawing we just created
    await page.evaluate(() => {
      const card = document.querySelector('.grid > div');
      if (card) card.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log("Navigation complete, check for errors above.");
    
  } catch (err) {
    console.error("Script error:", err);
  }
  
  await browser.close();
})();
