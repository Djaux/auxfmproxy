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

    const redirectUrl = intermediate.data.trim(); // это прямая ссылка на HTML

    const final = await axios.get(redirectUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = final.data;
    const $ = cheerio.load(html);
    const mp3link = $("source").attr("src") || final.data.match(/https:\/\/.*?\.mp3[^\s"']+/)?.[0];


    if (mp3link) {
      res.json({ stream: mp3link });
    } else {
      res.status(404).json({ error: "Stream link not found" });
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
