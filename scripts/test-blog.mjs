import puppeteer from 'puppeteer';
import path from 'path';

const outDir = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0';

async function testBlog() {
  console.log('Launching browser for Blog verification...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test /blog/ archive
  console.log('Navigating to http://localhost:3000/blog/...');
  const resArchive = await page.goto('http://localhost:3000/blog/', { waitUntil: 'networkidle2' });
  console.log('Archive Status:', resArchive.status());
  console.log('Archive Title:', await page.title());

  // Scroll and reset to trigger GSAP
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));

  console.log('Capturing blog_desktop_view.png...');
  await page.screenshot({ path: path.join(outDir, 'blog_desktop_view.png'), fullPage: true });

  // Test Search Filter on Archive
  console.log('Testing search filtering for "KNX"...');
  await page.type('input[aria-label="Search articles"]', 'KNX');
  await new Promise(r => setTimeout(r, 400));
  const cardCount = await page.$$eval('article', cards => cards.length);
  console.log(`Found ${cardCount} cards matching "KNX"`);

  // 2. Test Single Article: /knx-home-automation-functions-and-importance-in-smart-homes/
  console.log('Navigating to article: http://localhost:3000/knx-home-automation-functions-and-importance-in-smart-homes/...');
  const resArticle = await page.goto(
    'http://localhost:3000/knx-home-automation-functions-and-importance-in-smart-homes/',
    { waitUntil: 'networkidle2' }
  );
  console.log('Article Status:', resArticle.status());
  console.log('Article Title:', await page.title());

  // Check Schema tags
  const schemas = await page.$$eval('script[type="application/ld+json"]', scripts =>
    scripts.map(s => {
      try { return JSON.parse(s.innerHTML)['@type']; } catch(e) { return null; }
    })
  );
  console.log('Article Schema Types:', schemas);

  // Scroll down halfway to test reading progress bar
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 500));
  const progressWidth = await page.$eval('[role="progressbar"]', el => el.style.width);
  console.log('Reading progress bar width:', progressWidth);

  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  console.log('Capturing article_desktop_view.png...');
  await page.screenshot({ path: path.join(outDir, 'article_desktop_view.png'), fullPage: true });

  // 3. Mobile Viewport for Article (375x812)
  console.log('Testing mobile viewport (375x812)...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/knx-home-automation-functions-and-importance-in-smart-homes/', {
    waitUntil: 'networkidle2',
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Capturing article_mobile_view.png...');
  await page.screenshot({ path: path.join(outDir, 'article_mobile_view.png'), fullPage: true });

  await browser.close();
  console.log('Blog testing and verification complete!');
}

testBlog().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
