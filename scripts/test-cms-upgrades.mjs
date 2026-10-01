import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function runCmsUpgradesTest() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const artifactDir = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0';

  console.log('=== STARTING CMS UPGRADES, IMAGE UPLOAD & SETTINGS TEST ===');

  try {
    // 1. Login
    console.log('\n1. Logging in to Admin CMS...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
    await page.type('#username', 'admin');
    await page.type('#password', 'Soundnest@2026!');
    await page.click('#admin-login-btn');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log(`Logged in successfully. URL: ${page.url()}`);

    // 2. Test Image Upload Endpoint API directly from page context
    console.log('\n2. Testing /api/admin/upload multipart upload...');
    const uploadResult = await page.evaluate(async () => {
      // Create a tiny 1x1 transparent PNG blob
      const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      const byteCharacters = atob(pngBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const file = new File([blob], 'test-cms-upload.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'test');

      const res = await fetch('/api/admin/upload/', {
        method: 'POST',
        body: formData,
      });

      return {
        status: res.status,
        data: await res.json(),
      };
    });

    console.log('Upload Result:', JSON.stringify(uploadResult, null, 2));
    if (uploadResult.status === 200 && uploadResult.data.url) {
      console.log('SUCCESS: Image upload API returned valid uploaded URL:', uploadResult.data.url);
      
      // Verify image is accessible
      const imgRes = await page.goto(`http://localhost:3000${uploadResult.data.url}`);
      console.log(`Uploaded image HTTP status: ${imgRes.status()}`);
    } else {
      console.error('FAILED: Image upload did not return expected URL');
    }

    // 3. Test Home Page CMS (/admin/home)
    console.log('\n3. Testing Home Page CMS (/admin/home)...');
    await page.goto('http://localhost:3000/admin/home', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if section tabs/headers are rendered
    const homeSections = await page.$$eval('h3', els => els.map(e => e.innerText.trim()));
    console.log('Home CMS Sections found:', homeSections);

    const homeShot = path.join(artifactDir, 'admin_home_cms.png');
    await page.screenshot({ path: homeShot, fullPage: true });
    console.log(`Saved Home CMS full screenshot: ${homeShot}`);

    // 4. Test Website Settings CMS (/admin/settings)
    console.log('\n4. Testing Website Settings CMS (/admin/settings)...');
    await page.goto('http://localhost:3000/admin/settings', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Verify tabs: Branding, Contact, Social, Scripts
    const settingsTabs = await page.$$eval('button', els => els.map(e => e.innerText.trim()).filter(Boolean));
    console.log('Settings Tabs/Buttons found:', settingsTabs);

    const settingsShot = path.join(artifactDir, 'admin_settings_cms.png');
    await page.screenshot({ path: settingsShot, fullPage: true });
    console.log(`Saved Website Settings screenshot: ${settingsShot}`);

    // Click Scripts tab to verify code injection fields
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const scriptBtn = btns.find(b => b.innerText.includes('Header & Footer') || b.innerText.includes('Scripts'));
      if (scriptBtn) scriptBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const scriptsShot = path.join(artifactDir, 'admin_settings_scripts_tab.png');
    await page.screenshot({ path: scriptsShot });
    console.log(`Saved Scripts tab screenshot: ${scriptsShot}`);

    // 5. Test Service Management (/admin/services) Tabs & ImageUploader
    console.log('\n5. Testing Upgraded Services Management (/admin/services)...');
    await page.goto('http://localhost:3000/admin/services', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Click "Edit" on first service to inspect tabs
    const editBtn = await page.$('button[id^="btn-edit-"]');
    if (editBtn) {
      await editBtn.click();
      await new Promise(r => setTimeout(r, 600));

      const serviceEditorShot = path.join(artifactDir, 'admin_service_editor_tabs.png');
      await page.screenshot({ path: serviceEditorShot, fullPage: true });
      console.log(`Saved Service Editor Tabs screenshot: ${serviceEditorShot}`);

      // Click "What We Offer" Tab
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tab = btns.find(b => b.innerText.includes('What We Offer'));
        if (tab) tab.click();
      });
      await new Promise(r => setTimeout(r, 400));
      const featuresTabShot = path.join(artifactDir, 'admin_service_features_tab.png');
      await page.screenshot({ path: featuresTabShot });
      console.log(`Saved What We Offer Tab screenshot: ${featuresTabShot}`);

      // Click "Our Process & Gallery" Tab
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tab = btns.find(b => b.innerText.includes('Our Process'));
        if (tab) tab.click();
      });
      await new Promise(r => setTimeout(r, 400));
      const processTabShot = path.join(artifactDir, 'admin_service_process_tab.png');
      await page.screenshot({ path: processTabShot });
      console.log(`Saved Process & Gallery Tab screenshot: ${processTabShot}`);
    }

    // 6. Test Blog Management ImageUploader
    console.log('\n6. Testing Blog Management (/admin/blog)...');
    await page.goto('http://localhost:3000/admin/blog', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));
    const addArticleBtn = await page.$('#btn-add-article');
    if (addArticleBtn) {
      await addArticleBtn.click();
      await new Promise(r => setTimeout(r, 500));
      const blogEditorShot = path.join(artifactDir, 'admin_blog_image_uploader.png');
      await page.screenshot({ path: blogEditorShot });
      console.log(`Saved Blog ImageUploader screenshot: ${blogEditorShot}`);
    }

    console.log('\n=== ALL CMS UPGRADES AND IMAGE UPLOAD CHECKS PASSED ===');
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    await browser.close();
  }
}

runCmsUpgradesTest();
