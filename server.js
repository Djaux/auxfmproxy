const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/stream-url", async (req, res) => {
  try {
    const intermediate = await axios.post(
      "https://auxfmua.radio12345.com/openfire.ajax.php?radio_id=3350634",
      {},
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const redirectUrl = intermediate.data.trim();

    const final = await axios.get(redirectUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      responseType: "text"
    });

    let html = final.data;
    if (typeof html !== "string") {
      html = String(html);
    }
    console.log("=== HTML START ===");
    console.log(html);
    console.log("RAW FINAL DATA:", final.data);
    console.log("=== HTML END ===");
    
    const $ = cheerio.load(html);

    let mp3link = $("source").attr("src");

    if (!mp3link) {
      const match = html.match(/https:\/\/.*?\.mp3[^\s"']+/);
      if (match) mp3link = match[0];
    }

    if (mp3link) {
      res.json({ stream: mp3link });
    } else {
      console.log("MP3 not found in response.");
      res.status(404).json({ error: "Stream link not found" });
    }

  } catch (e) {
    console.error("Error fetching stream:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
