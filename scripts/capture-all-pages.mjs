import puppeteer from 'puppeteer';
import path from 'path';

const outDir = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0';

const pagesToCapture = [
  { url: 'http://localhost:3000/retro-fit-automation', name: 'service_page_retrofit.png' },
  { url: 'http://localhost:3000/contact-us', name: 'contact_page.png' },
  { url: 'http://localhost:3000/about-us', name: 'about_us_page.png' },
  { url: 'http://localhost:3000/blog', name: 'blog_archive_page.png' },
  { url: 'http://localhost:3000/knx-home-automation-functions-and-importance-in-smart-homes', name: 'blog_detail_post.png' },
];

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const item of pagesToCapture) {
    console.log(`Navigating to ${item.url}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 1200));

      // Scroll smoothly to trigger GSAP triggers & reveal images
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
          }, 80);
        });
      });

      await new Promise((r) => setTimeout(r, 1500));

      const savePath = path.join(outDir, item.name);
      console.log(`Capturing full page to ${savePath}...`);
      await page.screenshot({ path: savePath, fullPage: true });
      console.log(`Saved ${item.name}!`);
    } catch (err) {
      console.error(`Error capturing ${item.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('All pages captured successfully!');
}

capture().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
