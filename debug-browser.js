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
    await page.goto("http://localhost:5173/whiteboard", { waitUntil: "networkidle2", timeout: 10000 });
    // Click on a whiteboard drawing to open the editor
    await page.waitForSelector(".grid > div", { timeout: 3000 });
    await page.click(".grid > div");
    
    // Wait for Excalidraw to mount
    await new Promise(r => setTimeout(r, 2000));
    console.log("Done waiting.");
  } catch (err) {
    console.error("Script error:", err);
  }
  
  await browser.close();
})();
