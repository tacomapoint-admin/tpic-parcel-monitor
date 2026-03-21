const fs = require('fs');
const fetch = require('node-fetch');

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbySRKe4j4kmRrqDvXTbfNp8NNRYUWtyPGeC-xwbVWO5mbM-U9zJDsCLVxjhSEOWl4xQ5g/exec';
const INPUT_FILE = 'results.json';

async function main() {
  console.log('Reading results.json...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error('results.json not found');
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT_FILE, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data) || data.length === 0) {
    console.log('No data to send');
    return;
  }

  const rows = data.map(r => ({
    parcelNumber: r.parcelNumber || '',
    siteAddress: r.siteAddress || '',
    taxpayerName: r.taxpayerName || ''
  }));

  console.log(`Sending ${rows.length} rows to Google Sheets...`);

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rows })
  });

  const text = await response.text();

  console.log('HTTP Status:', response.status);
  console.log('Webhook response:');
  console.log(text);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
