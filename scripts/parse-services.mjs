import fs from 'fs';

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const files = [
  { slug: 'retro-fit-automation', file: 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0\\.system_generated\\steps\\501\\content.md' },
  { slug: 'building-automation', file: 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0\\.system_generated\\steps\\503\\content.md' },
  { slug: 'curtain-motor', file: 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0\\.system_generated\\steps\\505\\content.md' },
  { slug: 'home-cinema-audio-video', file: 'C:\\Users\\LENOVO 2\\.gemini\\antigravity-ide\\brain\\6ee715f4-3239-42bf-9160-6240dc0ea4f0\\.system_generated\\steps\\507\\content.md' },
];

const results = [];

for (const f of files) {
  if (!fs.existsSync(f.file)) {
    console.log('Missing file', f.file);
    continue;
  }
  const content = fs.readFileSync(f.file, 'utf8');

  // Title
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';

  // Meta Description
  const descMatch = content.match(/<meta name="description" content="(.*?)"/);
  const description = descMatch ? descMatch[1] : '';

  // h1
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  const h1 = h1Match ? cleanText(h1Match[1]) : '';

  // Subtitle
  const subMatch = content.match(/<div class="title-after_title">(.*?)<\/div>/);
  const subtitle = subMatch ? cleanText(subMatch[1]) : '';

  // Find info boxes
  const boxMatches = [...content.matchAll(/<div class="info-box-content">[\s\S]*?<h4[^>]*>(.*?)<\/h4>[\s\S]*?<div class="info-box-inner[^"]*">([\s\S]*?)<\/div>/g)];
  const features = boxMatches.map(m => ({
    title: cleanText(m[1]),
    description: cleanText(m[2]),
  }));

  // Find images
  const imgMatches = [...content.matchAll(/src="(https:\/\/soundnest\.in\/wp-content\/uploads\/[^"]+)"/g)];
  const images = [...new Set(imgMatches.map(m => m[1]))].filter(url => !url.includes('logo') && !url.includes('fevicon'));

  results.push({
    slug: f.slug,
    title,
    description,
    h1,
    subtitle,
    featuresCount: features.length,
    features,
    images,
  });
}

console.log(JSON.stringify(results, null, 2));
fs.writeFileSync('scripts/parsed-services.json', JSON.stringify(results, null, 2));
