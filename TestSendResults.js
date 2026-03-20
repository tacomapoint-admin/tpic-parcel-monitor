const fs = require("fs");

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxRXToTO9xqoOgC8pyskMw8LdYFLkn1DXglqDBeDPvS_Iv7jqlENtbv-Xj8eCTdJNmENw/exec";

async function sendJson() {
  try {
    const raw = fs.readFileSync("results.json", "utf8");
    const rows = JSON.parse(raw);

    console.log("Read file successfully.");
    console.log("Row count:", rows.length);
    console.log("First row:", rows[0]);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ rows })
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
