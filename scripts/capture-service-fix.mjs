import puppeteer from 'puppeteer';
import path from 'path';

const outDir = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0';

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/retro-fit-automation...');
  await page.goto('http://localhost:3000/retro-fit-automation', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  // Scroll smoothly down to reveal all sections
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 70);
    });
  });

  await new Promise((r) => setTimeout(r, 1500));

  const savePath = path.join(outDir, 'service_page_fixed.png');
  console.log(`Capturing full page to ${savePath}...`);
  await page.screenshot({ path: savePath, fullPage: true });
  console.log('Saved service_page_fixed.png!');

  await browser.close();
}

capture().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
