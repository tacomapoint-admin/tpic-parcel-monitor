const fs = require("fs");

const WEBHOOK_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

async function sendJson() {
  try {
    const raw = fs.readFileSync("results.json", "utf8");

    console.log("Read file successfully.");
    console.log("First 200 chars:");
    console.log(raw.slice(0, 200));

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: raw
    });

    const text = await response.text();

    console.log("HTTP Status:", response.status);
    console.log("Response body:");
    console.log(text);

  } catch (err) {
    console.error("ERROR:", err);
  }
}

sendJson();
