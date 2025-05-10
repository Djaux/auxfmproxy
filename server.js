const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/stream-url", async (req, res) => {
  try {
    const response = await axios.post(
      "https://auxfmua.radio12345.com/openfire.ajax.php?radio_id=3350634",
      {},
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const html = response.data;
    const $ = cheerio.load(html);
    const mp3link = $("source").attr("src") || html.match(/https:\/\/.*?\.mp3[^\s"']+/)?.[0];

    if (mp3link) {
      res.json({ stream: mp3link });
    } else {
      res.status(404).json({ error: "Stream link not found" });
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});