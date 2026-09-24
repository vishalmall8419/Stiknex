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
    
    // Inject a variety of corrupted legacy data to simulate the user's state
    await page.evaluate(() => {
      localStorage.setItem("whiteboards", JSON.stringify([
        {
          id: "wb_legacy_1",
          title: "Legacy 1",
          elements: [{ x: 10, y: 10 }], // Broken elements
        },
        {
          // Completely missing id and everything else
          title: "Legacy 2",
          elements: null,
          appState: null
        }
      ]));
    });
    
    await page.reload({ waitUntil: "networkidle2" });
    
    // Attempt to click the first legacy drawing
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.grid > div');
      if (cards.length > 0) cards[0].click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log("Clicked card 1.");
    
    // Go back (if it opened)
    await page.evaluate(() => {
      const btn = document.querySelector('.fa-arrow-left');
      if (btn) btn.closest('button').click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Attempt to click the second legacy drawing
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.grid > div');
      if (cards.length > 1) cards[1].click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log("Clicked card 2.");
    
  } catch (err) {
    console.error("Script error:", err);
  }
  
  await browser.close();
})();
