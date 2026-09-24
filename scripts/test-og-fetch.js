const https = require('https');

const imageUrl = 'https://raw.githubusercontent.com/muhsina-ov/shubam/main/og-image.jpg?v=1';

const testAgents = [
  { name: 'Standard HTTPS GET', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  { name: 'WhatsApp Scraper', ua: 'WhatsApp/2.21.12.21 A' },
  { name: 'Facebook External Hit', ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
  { name: 'Twitterbot', ua: 'Twitterbot/1.0' },
  { name: 'Telegram Bot', ua: 'TelegramBot (like TwitterBot)' }
];

async function testFetch(test) {
  return new Promise((resolve) => {
    const url = new URL(imageUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': test.ua,
        'Accept': 'image/jpeg,image/webp,image/*,*/*'
      }
    };

    const startTime = Date.now();
    const req = https.request(options, (res) => {
      let dataLen = 0;
      res.on('data', (chunk) => {
        dataLen += chunk.length;
      });
      res.on('end', () => {
        const elapsed = Date.now() - startTime;
        console.log(`[${test.name}]`);
        console.log(`  Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`  Content-Type: ${res.headers['content-type']}`);
        console.log(`  Downloaded: ${dataLen} bytes in ${elapsed}ms`);
        resolve(res.statusCode === 200 && dataLen > 0);
      });
    });

    req.on('error', (err) => {
      console.error(`[${test.name}] Error:`, err.message);
      resolve(false);
    });

    req.end();
  });
}

async function run() {
  console.log(`Testing image fetch from: ${imageUrl}\n`);
  for (const t of testAgents) {
    await testFetch(t);
    console.log('---');
  }
}

run();
