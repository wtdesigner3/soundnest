import fs from 'fs';

const steps = [
  { slug: 'retro-fit-automation', step: 501 },
  { slug: 'building-automation', step: 503 },
  { slug: 'curtain-motor', step: 505 },
  { slug: 'home-cinema-audio-video', step: 507 }
];

for (const s of steps) {
  const filePath = `C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0\\.system_generated\\steps\\${s.step}\\content.md`;
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const headings = [...content.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => ({
    tag: m[1],
    text: m[2].replace(/<[^>]+>/g, '').trim()
  }));
  console.log(`\n=== ${s.slug} ===`);
  console.log(headings.slice(0, 15));
}
