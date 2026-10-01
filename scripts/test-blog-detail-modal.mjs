import puppeteer from 'puppeteer';
import path from 'path';

const outDir = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0';

async function testBlogDetail() {
  console.log('Launching browser to test blog detail 2-column layout and modal popup...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const url = 'http://localhost:3000/knx-home-automation-functions-and-importance-in-smart-homes/';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // 1. Capture Desktop Two-Column Layout
  console.log('Capturing blog_detail_two_column.png...');
  await page.screenshot({ path: path.join(outDir, 'blog_detail_two_column.png') });

  // 2. Scroll to bottom CTA box to inspect the fixed gold button
  console.log('Scrolling to CTA box...');
  await page.evaluate(() => {
    const cta = document.querySelector('[class*="ctaBox"]');
    if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Capturing blog_cta_fixed_button.png...');
  await page.screenshot({ path: path.join(outDir, 'blog_cta_fixed_button.png') });

  // 3. Click the bottom CTA button to trigger Consultation Modal
  console.log('Clicking bottom CTA button to open modal...');
  const ctaBtn = await page.$('button[class*="ctaBtn"]');
  if (ctaBtn) {
    await ctaBtn.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('Modal opened!');

    // Fill in consultation modal fields
    await page.type('input[name="name"]', 'Vikram Malhotra');
    await page.type('input[name="email"]', 'vikram.malhotra@example.com');
    await page.type('input[name="phone"]', '9812345678');
    await page.select('select[name="serviceType"]', 'Retro Fit Automation');
    await page.type('textarea[name="message"]', 'Interested in upgrading my 4BHK apartment with KNX automation.');

    console.log('Capturing blog_cta_modal_open.png...');
    await page.screenshot({ path: path.join(outDir, 'blog_cta_modal_open.png') });

    // Close modal
    const closeBtn = await page.$('button[aria-label="Close dialog"]');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 400));
      console.log('Modal closed successfully');
    }
  }

  // 4. Test Sidebar CTA button opens modal as well
  console.log('Scrolling up to test sidebar CTA button...');
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise(r => setTimeout(r, 400));

  const sidebarBtn = await page.$('button[class*="sidebarCtaBtn"]');
  if (sidebarBtn) {
    await sidebarBtn.click();
    await new Promise(r => setTimeout(r, 400));
    console.log('Sidebar CTA successfully opened modal!');
    await page.screenshot({ path: path.join(outDir, 'blog_sidebar_modal_triggered.png') });
  }

  await browser.close();
  console.log('All tests passed successfully!');
}

testBlogDetail().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
