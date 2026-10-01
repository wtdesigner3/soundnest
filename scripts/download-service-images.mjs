import fs from 'fs';
import path from 'path';

const imageUrls = [
  "https://soundnest.in/wp-content/uploads/2025/10/retro-1-1.png",
  "https://soundnest.in/wp-content/uploads/2025/09/retro-2-80x80.png",
  "https://soundnest.in/wp-content/uploads/2025/10/retro-5.png",
  "https://soundnest.in/wp-content/uploads/2025/10/retro-6.png",
  "https://soundnest.in/wp-content/uploads/2025/10/retro-4.png",
  "https://soundnest.in/wp-content/uploads/2025/09/building-automation-2.jpg",
  "https://soundnest.in/wp-content/uploads/2025/09/building-automation-3.jpg",
  "https://soundnest.in/wp-content/uploads/2025/09/building-automation-4.jpg",
  "https://soundnest.in/wp-content/uploads/2025/09/building-automation-5.jpg",
  "https://soundnest.in/wp-content/uploads/2025/09/building-automation-6.jpg",
  "https://soundnest.in/wp-content/uploads/2025/09/services-1-2.jpg",
  "https://soundnest.in/wp-content/uploads/2025/09/services-1-3.jpg",
  "https://soundnest.in/wp-content/uploads/2025/09/services-1-1.jpg",
  "https://soundnest.in/wp-content/uploads/2025/10/services-1-1-1-1.jpg",
  "https://soundnest.in/wp-content/uploads/2025/10/curtain-motor-2.jpg",
  "https://soundnest.in/wp-content/uploads/2025/10/home-cinema-audio-video-2.jpg",
  "https://soundnest.in/wp-content/uploads/2025/10/home-cinema-audio-video-4.jpg"
];

async function downloadImages() {
  const destDir = path.resolve('public/images');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  console.log(`Starting download of ${imageUrls.length} service images...`);

  for (const url of imageUrls) {
    const filename = path.basename(url);
    const destPath = path.join(destDir, filename);

    if (fs.existsSync(destPath)) {
      console.log(`- Skipping ${filename} (already exists)`);
      continue;
    }

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        console.warn(`Failed to download ${url}: HTTP ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(destPath, buffer);
      console.log(`+ Downloaded ${filename} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${url}:`, err.message);
    }
  }

  console.log('All service images processed!');
}

downloadImages();
