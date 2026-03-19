import { chromium } from 'playwright';
import fetch from 'node-fetch';

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwXbmLZGEV8Ffjwx4l2_-NjWCffCzJ39hmlNLbX1KU4vkjYU1o-jZ8b2VZiS1ZWx-2hzQ/exec";

// 🔟 TEST WITH 10 PARCELS (fast)
const PARCELS = [
  "5075000310",
  "5075000010",
  "5075000601",
  "5075001451",
  "5075002210",
  "5075200031",
  "5075200102",
  "5075200160",
  "5075200140",
  "5075000760"
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const results = [];

  console.log(`Starting scrape for ${PARCELS.length} parcels`);

  for (const parcel of PARCELS) {
    const url = `https://atip.piercecountywa.gov/app/v2/propertyDetail/${parcel}/summary`;

    console.log(`Opening ${url}`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      await page.waitForTimeout(1500);

      const data = await page.evaluate(() => {
        const text = document.body.innerText;

        const getValue = (label) => {
          const regex = new RegExp(label + '\\s*\\n\\s*(.+)');
          const match = text.match(regex);
          return match ? match[1].trim() : '';
        };

        return {
          parcelNumber: getValue('Parcel Number'),
          siteAddress: getValue('Site Address'),
          taxpayerName: getValue('Taxpayer')
        };
      });

      if (data.parcelNumber) {
        results.push(data);
      }

    } catch (err) {
      console.log(`Failed parcel ${parcel}`);
    }
  }

  await browser.close();

  console.log("SCRAPE COMPLETE");
  console.log(results);

  // 🚀 SEND TO GOOGLE SHEET
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    });

    const text = await response.text();
    console.log("Webhook response:", text);

  } catch (err) {
    console.error("Failed to send to Google Sheets:", err);
  }

})();
