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
  await new Promise(r => setTimeout(r, 1500));

  // Scroll down smoothly through the page to trigger all GSAP ScrollTriggers
  console.log('Scrolling through page to trigger animations...');
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

  await new Promise(r => setTimeout(r, 1500));

  // 1. Desktop Full Page
  console.log('Capturing desktop full page...');
  await page.screenshot({ path: path.join(outDir, 'nextjs_desktop_full_revealed.png'), fullPage: true });

  // 2. Section by section screenshots:
  // About Us
  const aboutEl = await page.$('#about-us');
  if (aboutEl) {
    console.log('Capturing About section...');
    await aboutEl.screenshot({ path: path.join(outDir, 'nextjs_section_about.png') });
  }

  // Services
  const servicesEl = await page.$('#services');
  if (servicesEl) {
    console.log('Capturing Services section...');
    await servicesEl.screenshot({ path: path.join(outDir, 'nextjs_section_services.png') });
  }

  // Testimonials
  const testEl = await page.$('#testimonials');
  if (testEl) {
    console.log('Capturing Testimonials section...');
    await testEl.screenshot({ path: path.join(outDir, 'nextjs_section_testimonials.png') });
  }

  // Contact
  const contactEl = await page.$('#contact');
  if (contactEl) {
    console.log('Capturing Contact section...');
    await contactEl.screenshot({ path: path.join(outDir, 'nextjs_section_contact.png') });
  }

  await browser.close();
  console.log('Detailed section screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
