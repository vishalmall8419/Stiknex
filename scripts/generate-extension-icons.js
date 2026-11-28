import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

async function generateIcons() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const logoBase64 = fs.readFileSync('public/logo.png').toString('base64');
  const logoDataUri = 'data:image/png;base64,' + logoBase64;
  
  const sizes = [16, 32, 48, 128];
  
  for (const size of sizes) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            width: ${size}px; 
            height: ${size}px; 
            background: transparent; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
          }
          img { 
            max-width: ${size}px; 
            max-height: ${size}px; 
            object-fit: contain; 
          }
        </style>
      </head>
      <body>
        <img src="${logoDataUri}" />
      </body>
      </html>
    `;
    
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(html);
    
    const outPath = path.join('extension', 'assets', 'icons', `icon-${size}.png`);
    await page.screenshot({ path: outPath, omitBackground: true });
    console.log('Generated icon:', outPath, `${size}x${size}`);
  }
  
  await browser.close();
  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Icon generation error:', err);
  process.exit(1);
});

