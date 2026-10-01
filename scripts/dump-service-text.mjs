import fs from 'fs';

const steps = [
  { slug: 'retro-fit-automation', step: 501 },
  { slug: 'building-automation', step: 503 },
  { slug: 'curtain-motor', step: 505 },
  { slug: 'home-cinema-audio-video', step: 507 }
];

for (const s of steps.slice(0, 1)) {
  const filePath = `C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0\\.system_generated\\steps\\${s.step}\\content.md`;
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n========================================`);
  console.log(`PAGE: ${s.slug}`);
  console.log(`========================================`);

  // Print all text blocks
  const clean = content
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 2 && !line.includes('{') && !line.includes('}') && !line.includes('wp-') && !line.includes('var(') && !line.includes('function'));

  console.log(clean.slice(0, 60).join('\n'));
}
