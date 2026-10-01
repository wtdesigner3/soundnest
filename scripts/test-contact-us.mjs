import puppeteer from 'puppeteer';
import path from 'path';

const outDir = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0';

async function testContactUs() {
  console.log('Launching browser for Contact Us verification...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/contact-us/...');
  const response = await page.goto('http://localhost:3000/contact-us/', { waitUntil: 'networkidle2' });
  console.log('Response status:', response.status());

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  // Check Schema tags
  const schemas = await page.$$eval('script[type="application/ld+json"]', scripts =>
    scripts.map(s => JSON.parse(s.innerHTML))
  );
  console.log('Found Schemas:', schemas.map(s => s['@type']));

  // Scroll smoothly to trigger ScrollTriggers
  await page.evaluate(async () => {
    window.scrollBy(0, 600);
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(async () => {
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 600));

  // Capture initial page state
  console.log('Capturing contact_desktop_view.png...');
  await page.screenshot({ path: path.join(outDir, 'contact_desktop_view.png'), fullPage: true });

  // Test FAQ accordion: Click on the 2nd FAQ
  console.log('Testing FAQ Accordion click...');
  const secondFaqButton = await page.$('#faq-header-faq-2');
  if (secondFaqButton) {
    await secondFaqButton.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // Fill in the Contact Form
  console.log('Filling out contact form...');
  await page.type('input[name="name"]', 'Aarav Sharma');
  await page.type('input[name="email"]', 'aarav.sharma@example.com');
  await page.type('input[name="phone"]', '9876543210');
  await page.select('select[name="serviceType"]', 'Home Cinema & Audio Video');
  await page.type('textarea[name="message"]', 'Hello Soundnest team, I would like to schedule a private studio demonstration for a 7.2.4 Dolby Atmos cinema system.');

  // Capture form filled state
  await page.screenshot({ path: path.join(outDir, 'contact_form_filled.png') });

  // Submit the form
  console.log('Submitting form...');
  await page.click('button[type="submit"]');

  // Wait for response banner
  await page.waitForSelector('[role="alert"]', { timeout: 10000 });
  const alertText = await page.$eval('[role="alert"]', el => el.textContent);
  console.log('Form submission response:', alertText);

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'contact_form_submitted.png') });

  // Mobile Viewport Test
  console.log('Testing mobile viewport (375x812)...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/contact-us/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'contact_mobile_view.png'), fullPage: true });

  await browser.close();
  console.log('Verification completed successfully!');
}

testContactUs().catch(err => {
  console.error('Contact Us verification error:', err);
  process.exit(1);
});
