const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/stream-url", async (req, res) => {
  try {
    const response = await axios.get("https://auxfmua.radio12345.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      responseType: "text"
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const mp3link = $("#urladdress").text().trim(); // <-- здесь ссылка!

    if (mp3link && mp3link.startsWith("http")) {
      res.json({ stream: mp3link });
    } else {
      res.status(404).json({ error: "Stream link not found" });
    }

  } catch (e) {
    console.error("Ошибка:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
