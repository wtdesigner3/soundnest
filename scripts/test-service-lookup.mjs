import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import { getServiceBySlug } from '../src/lib/services.js';

async function test() {
  console.log('Testing static service lookup: retro-fit-automation');
  const s1 = await getServiceBySlug('retro-fit-automation');
  console.log('Result:', s1 ? s1.name : 'NOT FOUND');

  console.log('Testing dynamic MongoDB service lookup...');
  const s2 = await getServiceBySlug('non-existent-test');
  console.log('Result:', s2 ? s2.name : 'NOT FOUND (Expected)');
}

test();
