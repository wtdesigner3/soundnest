import puppeteer from 'puppeteer';
import path from 'path';

const outDir = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0';

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll down smoothly through the page to trigger all GSAP ScrollTriggers and image loads
  console.log('Scrolling through page to trigger animations & load assets...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // Return to top
          resolve();
        }
      }, 100);
    });
  });

  // Short pause for settle
  await new Promise(r => setTimeout(r, 2000));

  // 1. Desktop Full Page
  console.log('Capturing desktop full page...');
  await page.screenshot({ path: path.join(outDir, 'nextjs_desktop_full_revealed.png'), fullPage: true });

  // 1b. Capture Header + Hero viewport
  console.log('Capturing Header + Hero viewport...');
  await page.screenshot({ path: path.join(outDir, 'nextjs_hero_header.png') });

  // For individual section screenshots, temporarily hide the sticky header so it doesn't overlap section tops
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
  });

  // 2. Section by section screenshots:
  const aboutEl = await page.$('#about-us');
  if (aboutEl) {
    console.log('Capturing About section...');
    await aboutEl.screenshot({ path: path.join(outDir, 'nextjs_section_about.png') });
  }

  const servicesEl = await page.$('#services');
  if (servicesEl) {
    console.log('Capturing Services section...');
    await servicesEl.screenshot({ path: path.join(outDir, 'nextjs_section_services.png') });
  }

  const testEl = await page.$('#testimonials');
  if (testEl) {
    console.log('Capturing Testimonials section...');
    await testEl.screenshot({ path: path.join(outDir, 'nextjs_section_testimonials.png') });
  }

  const ctaEl = await page.$('#cta-banner');
  if (ctaEl) {
    console.log('Capturing CTA banner section...');
    await ctaEl.screenshot({ path: path.join(outDir, 'nextjs_section_cta.png') });
  }

  const contactEl = await page.$('#contact');
  if (contactEl) {
    console.log('Capturing Contact section...');
    await contactEl.screenshot({ path: path.join(outDir, 'nextjs_section_contact.png') });
  }

  const footerEl = await page.$('footer');
  if (footerEl) {
    console.log('Capturing Footer section...');
    await footerEl.screenshot({ path: path.join(outDir, 'nextjs_section_footer.png') });
  }

  await browser.close();
  console.log('Detailed section screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
