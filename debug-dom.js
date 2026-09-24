import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto("https://stiknex.vercel.app/notebook", { waitUntil: "networkidle2" });
    
    // Get the HTML of the root element
    const html = await page.evaluate(() => {
      const root = document.querySelector('#root');
      return root ? root.innerHTML : 'No root found';
    });
    
    console.log("HTML EXTRACTED:");
    console.log(html.substring(0, 3000)); // Print first 3000 chars of HTML
    
  } catch (err) {
    console.error("Script error:", err);
  }
  
  await browser.close();
})();
