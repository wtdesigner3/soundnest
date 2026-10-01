import fs from 'fs';

async function fetchPosts() {
  const url = 'https://soundnest.in/wp-json/wp/v2/posts?per_page=100';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  const posts = await res.json();
  console.log(`Fetched ${posts.length} posts from WordPress REST API:`);
  posts.forEach(p => {
    console.log(`- [${p.id}] ${p.slug} => "${p.title.rendered}"`);
  });

  fs.writeFileSync('scripts/raw-posts.json', JSON.stringify(posts, null, 2));
}

fetchPosts().catch(err => {
  console.error('Fetch error:', err);
});
