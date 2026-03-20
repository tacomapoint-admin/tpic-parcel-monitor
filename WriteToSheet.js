const fs = require('fs');
const fetch = require('node-fetch');

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwXbmLZGEV8Ffjwx4l2_-NjWCffCzJ39hmlNLbX1KU4vkjYU1o-jZ8b2VZiS1ZWx-2hzQ/exec';
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

  const runDate = new Date().toISOString();

  const rows = data.map(r => ({
    RunDate: runDate,
    ParcelNumber: r.parcelNumber || '',
    SiteAddress: r.siteAddress || '',
    TaxpayerName: r.taxpayerName || ''
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

  console.log('Webhook response:');
  console.log(text);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
