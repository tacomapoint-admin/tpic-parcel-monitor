const { chromium } = require('playwright');

/*
  ============================================
  TEST PARCEL LIST (10 sample parcels)
  Chosen from your corrected master list
  ============================================
*/
const PARCELS = [
  '0520054030',
  '0520058007',
  '5060000070',
  '5060000320',
  '5075000010',
  '5075000601',
  '5075001451',
  '5075002210',
  '5075200031',
  '5075200102'
];

/*
  ============================================
  SETTINGS
  ============================================
*/
const NAVIGATION_TIMEOUT_MS = 12000;
const CONTENT_TIMEOUT_MS = 6000;
const MAX_ATTEMPTS = 2;

/*
  ============================================
  HELPERS
  ============================================
*/
function extractField(bodyText, label, nextLabels) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedNext = nextLabels
    .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(
    `${escapedLabel}\\s+([\\s\\S]*?)(?=\\s+(?:${escapedNext})\\b|$)`,
    'i'
  );

  const match = bodyText.match(regex);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

async function waitForParcelContent(page) {
  await page.waitForFunction(() => {
    const text = document.body?.innerText || '';
    return text.includes('Parcel Number') && text.includes('Taxpayer Name');
  }, { timeout: CONTENT_TIMEOUT_MS });
}

async function scrapeParcel(page, parcelNumber) {
  const url = `https://atip.piercecountywa.gov/app/v2/propertyDetail/${parcelNumber}/summary`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`Opening ${parcelNumber} (attempt ${attempt}/${MAX_ATTEMPTS})`);

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: NAVIGATION_TIMEOUT_MS,
      });

      await waitForParcelContent(page);

      const bodyText = await page.locator('body').innerText();

      const parcelNumberFound = extractField(bodyText, 'Parcel Number', [
        'Site Address',
        'Account Type',
        'Category',
        'Use Code',
        'Taxpayer Name',
        'Mailing Address',
      ]);

      const siteAddress = extractField(bodyText, 'Site Address', [
        'Account Type',
        'Category',
        'Use Code',
        'Taxpayer Name',
        'Mailing Address',
        'Parcel Number',
      ]);

      const taxpayerName = extractField(bodyText, 'Taxpayer Name', [
        'Mailing Address',
        'Parcel Number',
        'Site Address',
        'Account Type',
        'Category',
        'Use Code',
      ]);

      if (parcelNumberFound && siteAddress && taxpayerName) {
        return {
          parcelNumber: parcelNumberFound,
          siteAddress,
          taxpayerName,
        };
      }

      throw new Error('Required fields were not fully extracted');
    } catch (err) {
      console.log(`Attempt ${attempt} failed for ${parcelNumber}: ${err.message}`);

      if (attempt === MAX_ATTEMPTS) {
        return {
          parcelNumber,
          siteAddress: '',
          taxpayerName: '',
          error: err.message,
        };
      }
    }
  }
}

async function main() {
  console.log(`Starting scrape for ${PARCELS.length} parcels`);

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1400 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
  });

  const results = [];

  try {
    for (let i = 0; i < PARCELS.length; i++) {
      const parcel = PARCELS[i];
      console.log(`Processing ${i + 1}/${PARCELS.length}: ${parcel}`);

      const result = await scrapeParcel(page, parcel);
      results.push(result);
    }

    console.log('SCRAPE_RESULTS_START');
    console.log(JSON.stringify(results, null, 2));
    console.log('SCRAPE_RESULTS_END');

    const successCount = results.filter(r => r.siteAddress && r.taxpayerName).length;
    const failCount = results.length - successCount;

    console.log(`Summary: ${successCount} succeeded, ${failCount} failed`);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
