const { chromium } = require('playwright');
const fs = require('fs');

/*
  ============================================
  FULL PARCEL LIST (325)
  ============================================
*/
const PARCELS = [
  '0520054030', '0520054071', '0520054500', '0520058007', '0520058009',
  '0520058010', '5060000010', '5060000020', '5060000030', '5060000040',
  '5060000051', '5060000070', '5060000080', '5060000090', '5060000100',
  '5060000110', '5060000120', '5060000130', '5060000140', '5060000150',
  '5060000160', '5060000170', '5060000180', '5060000190', '5060000200',
  '5060000210', '5060000221', '5060000240', '5060000250', '5060000260',
  '5060000270', '5060000280', '5060000290', '5060000300', '5060000310',
  '5060000320', '5060000330', '5060000340', '5060000350', '5060000360',
  '5060000370', '5060000380', '5060000390', '5060000400', '5060000410',
  '5060000421', '5060000422', '5060000430', '5060000440', '5060000450',
  '5060000461', '5060000471', '5060000480', '5060000490', '5060000500',
  '5060000510', '5075000010', '5075000020', '5075000030', '5075000040',
  '5075000050', '5075000060', '5075000070', '5075000080', '5075000090',
  '5075000100', '5075000110', '5075000120', '5075000130', '5075000150',
  '5075000160', '5075000170', '5075000180', '5075000190', '5075000200',
  '5075000230', '5075000240', '5075000250', '5075000260', '5075000270',
  '5075000280', '5075000290', '5075000300', '5075000311', '5075000321',
  '5075000330', '5075000340', '5075000350', '5075000360', '5075000370',
  '5075000380', '5075000390', '5075000400', '5075000410', '5075000420',
  '5075000430', '5075000440', '5075000450', '5075000460', '5075000470',
  '5075000480', '5075000490', '5075000500', '5075000510', '5075000520',
  '5075000530', '5075000540', '5075000550', '5075000560', '5075000570',
  '5075000580', '5075000590', '5075000601', '5075000620', '5075000630',
  '5075000640', '5075000650', '5075000660', '5075000670', '5075000680',
  '5075000690', '5075000700', '5075000710', '5075000720', '5075000730',
  '5075000741', '5075000770', '5075000780', '5075000790', '5075000800',
  '5075000810', '5075000820', '5075000830', '5075000840', '5075000850',
  '5075000860', '5075000870', '5075000880', '5075000890', '5075000900',
  '5075000910', '5075000920', '5075000930', '5075000940', '5075000950',
  '5075000960', '5075000970', '5075000980', '5075000990', '5075001000',
  '5075001010', '5075001020', '5075001030', '5075001040', '5075001050',
  '5075001060', '5075001070', '5075001080', '5075001090', '5075001100',
  '5075001110', '5075001120', '5075001130', '5075001140', '5075001150',
  '5075001160', '5075001165', '5075001170', '5075001180', '5075001191',
  '5075001192', '5075001200', '5075001210', '5075001220', '5075001230',
  '5075001240', '5075001250', '5075001260', '5075001270', '5075001280',
  '5075001290', '5075001300', '5075001310', '5075001320', '5075001330',
  '5075001340', '5075001350', '5075001360', '5075001370', '5075001380',
  '5075001390', '5075001400', '5075001410', '5075001420', '5075001430',
  '5075001440', '5075001451', '5075001461', '5075001470', '5075001480',
  '5075001490', '5075001500', '5075001510', '5075001520', '5075001530',
  '5075001540', '5075001550', '5075001560', '5075001570', '5075001580',
  '5075001590', '5075001600', '5075001610', '5075001620', '5075001630',
  '5075001640', '5075001650', '5075001660', '5075001670', '5075001680',
  '5075001710', '5075001730', '5075001740', '5075001750', '5075001760',
  '5075001770', '5075001780', '5075001790', '5075001800', '5075001810',
  '5075001820', '5075001841', '5075001850', '5075001860', '5075001870',
  '5075001880', '5075001890', '5075001900', '5075001910', '5075001920',
  '5075001930', '5075001940', '5075001950', '5075001960', '5075001970',
  '5075001980', '5075001990', '5075002000', '5075002010', '5075002020',
  '5075002030', '5075002040', '5075002050', '5075002060', '5075002070',
  '5075002080', '5075002090', '5075002100', '5075002110', '5075002120',
  '5075002130', '5075002140', '5075002150', '5075002160', '5075002170',
  '5075002180', '5075002190', '5075002202', '5075002203', '5075002210',
  '5075002221', '5075002222', '5075002230', '5075002240', '5075002250',
  '5075002260', '5075002271', '5075002290', '5075002300', '5075002310',
  '5075002321', '5075002322', '5075002330', '5075002340', '5075002350',
  '5075002360', '5075002371', '5075002372', '5075002380', '5075002400',
  '5075002411', '5075002412', '5075002423', '5075002431', '5075002432',
  '5075002441', '5075002442', '5075002451', '5075002452', '5075002463',
  '5075002472', '5075002473', '5075002474', '5075002475', '5075002476',
  '5075002479', '5075002483', '5075002484', '5075002485', '5075002486',
  '5075002487', '5075002488', '5075002489', '5075002490', '5075002491',
  '5075200010', '5075200020', '5075200031', '5075200040', '5075200050',
  '5075200060', '5075200070', '5075200080', '5075200090', '5075200102'
];

/*
  ============================================
  SETTINGS
  ============================================
*/
const NAVIGATION_TIMEOUT_MS = 12000;
const CONTENT_TIMEOUT_MS = 6000;
const MAX_ATTEMPTS = 2;
const OUTPUT_FILE = 'results.json';

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

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Saved ${results.length} records to ${OUTPUT_FILE}`);

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
