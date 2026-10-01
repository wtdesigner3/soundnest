import fs from 'fs';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { MongoClient } from 'mongodb';

function cleanHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function stripHtml(html) {
  if (!html) return '';
  return cleanHtmlEntities(html.replace(/<[^>]*>?/gm, ''));
}

function calculateReadTime(text) {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function getCategoryForPost(slug, title) {
  const s = (slug + ' ' + title).toLowerCase();
  if (s.includes('knx') || s.includes('automation') || s.includes('smartnode') || s.includes('elan') || s.includes('control4')) {
    return 'Smart Automation';
  }
  if (s.includes('speaker') || s.includes('audio') || s.includes('jbl') || s.includes('marshall') || s.includes('acoustics') || s.includes('cable') || s.includes('denon') || s.includes('marantz') || s.includes('wiim')) {
    return 'Audio & Cinema';
  }
  if (s.includes('lutron') || s.includes('lighting')) {
    return 'Smart Lighting';
  }
  if (s.includes('intercom') || s.includes('akuvox') || s.includes('grandstream') || s.includes('door') || s.includes('display')) {
    return 'Intercom & Security';
  }
  return 'Smart Homes';
}

async function run() {
  const rawData = JSON.parse(fs.readFileSync('scripts/raw-posts.json', 'utf8'));
  console.log(`Processing ${rawData.length} articles...`);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const processed = rawData.map(post => {
    const postDate = new Date(post.date);
    const day = String(postDate.getDate()).padStart(2, '0');
    const month = monthNames[postDate.getMonth()];
    const fullMonth = fullMonthNames[postDate.getMonth()];
    const year = postDate.getFullYear();
    const formattedDate = `${fullMonth} ${postDate.getDate()}, ${year}`;

    const cleanTitle = cleanHtmlEntities(post.title.rendered);
    const plainContent = stripHtml(post.content.rendered);
    const readTime = calculateReadTime(plainContent);
    const category = getCategoryForPost(post.slug, cleanTitle);

    let cleanExcerpt = stripHtml(post.excerpt.rendered);
    if (!cleanExcerpt || cleanExcerpt.length < 20) {
      cleanExcerpt = plainContent.slice(0, 160) + '...';
    }

    return {
      id: post.id,
      slug: post.slug,
      title: cleanTitle,
      excerpt: cleanExcerpt,
      contentHtml: post.content.rendered,
      date: post.date,
      day,
      month,
      year,
      formattedDate,
      readTime,
      category,
      author: 'lexoro',
      url: `https://soundnest.in/${post.slug}/`,
      seo: {
        title: `${cleanTitle} - Soundnest`,
        description: cleanExcerpt.slice(0, 155),
        canonical: `https://soundnest.in/${post.slug}/`,
      }
    };
  });

  // Write to src/data/blogData.js
  const fileContent = `// Auto-generated SoundNest Blog Articles Repository
export const blogPosts = ${JSON.stringify(processed, null, 2)};

export function getAllPosts() {
  return blogPosts;
}

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug, limit = 3) {
  const current = getPostBySlug(currentSlug);
  if (!current) return blogPosts.slice(0, limit);
  
  const sameCategory = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category === current.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
`;

  fs.writeFileSync('src/data/blogData.js', fileContent);
  console.log('src/data/blogData.js generated successfully!');

  // Seed into live MongoDB Atlas
  const uri = process.env.MONGODB_URI || "mongodb+srv://wtdesigner3_db_user:CWTYA3XHu6918Wn2@soundnestcluster.o0ngm0i.mongodb.net/soundnest?retryWrites=true&w=majority";
  console.log('Connecting to MongoDB Atlas to seed posts collection...');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('soundnest');
    const postsCollection = db.collection('posts');

    // Upsert each post
    for (const post of processed) {
      await postsCollection.updateOne(
        { slug: post.slug },
        { $set: { ...post, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const count = await postsCollection.countDocuments();
    console.log(`MongoDB Atlas synchronization complete! Total posts in database: ${count}`);
  } catch (err) {
    console.warn('MongoDB seed warning:', err.message);
  } finally {
    await client.close();
  }
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
