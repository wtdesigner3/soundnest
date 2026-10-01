import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  { url: 'https://soundnest.in/wp-content/uploads/2025/12/logo-1.png', dest: 'public/images/logo.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/fevicon.png', dest: 'public/images/favicon.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/slider-1.jpg', dest: 'public/images/slider-1.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/slider-2.jpg', dest: 'public/images/slider-2.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/slider-3.jpg', dest: 'public/images/slider-3.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/about-us-3.jpg', dest: 'public/images/about-us.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/bg-1.jpg', dest: 'public/images/services/retrofit.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/10/bg-4.jpg', dest: 'public/images/services/building.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/10/bg-3.jpg', dest: 'public/images/services/curtain.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/10/bg-2-2.jpg', dest: 'public/images/services/cinema.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/auto4.png', dest: 'public/images/brands/brand-1.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/auto6.png', dest: 'public/images/brands/brand-2.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/auto10.png', dest: 'public/images/brands/brand-3.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/autol1.png', dest: 'public/images/brands/brand-4.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/autol3.png', dest: 'public/images/brands/brand-5.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/enter1.png', dest: 'public/images/brands/brand-6.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/enterl3.png', dest: 'public/images/brands/brand-7.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-1.jpg', dest: 'public/images/brands/brand-8.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-2.jpg', dest: 'public/images/brands/brand-9.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-3.jpg', dest: 'public/images/brands/brand-10.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-4.jpg', dest: 'public/images/brands/brand-11.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-5.jpg', dest: 'public/images/brands/brand-12.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-6.jpg', dest: 'public/images/brands/brand-13.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-7.jpg', dest: 'public/images/brands/brand-14.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-8.jpg', dest: 'public/images/brands/brand-15.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-9.jpg', dest: 'public/images/brands/brand-16.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-10.jpg', dest: 'public/images/brands/brand-17.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-11.jpg', dest: 'public/images/brands/brand-18.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-12.jpg', dest: 'public/images/brands/brand-19.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/c-logo-13.jpg', dest: 'public/images/brands/brand-20.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/testimonial-1-80x80.png', dest: 'public/images/testimonials/avatar.png' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/09/banner2-1.jpg', dest: 'public/images/banner2.jpg' },
  { url: 'https://soundnest.in/wp-content/uploads/2025/10/home-cinema-audio-video-3.jpg', dest: 'public/images/cinema-demo.jpg' }
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const fullDest = path.resolve(process.cwd(), item.dest);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });

    const file = fs.createWriteStream(fullDest);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[OK] Downloaded: ${item.dest}`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(fullDest, () => {});
        console.error(`[FAIL] ${response.statusCode} for ${item.url}`);
        resolve(); // Continue even if one fails
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(fullDest, () => {});
      console.error(`[ERROR] ${item.url}: ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  console.log(`Starting download of ${downloads.length} assets...`);
  for (const item of downloads) {
    await downloadFile(item);
  }
  console.log('Finished downloading all assets!');
}

run();
