const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/stream-url", async (req, res) => {
  try {
    // 1. Получаем редирект-ссылку
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

    // 2. Получаем HTML с конечной страницы
    const final = await axios.get(redirectUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      responseType: "text"
    });

    const html = final.data;
    const $ = cheerio.load(html);

    // 3. Ищем ссылку на .mp3
    let mp3link = $("source").attr("src");
    if (!mp3link) {
      const match = html.match(/https:\/\/.*?\.mp3[^\s"']+/);
      if (match) mp3link = match[0];
    }

    // 4. Отдаём результат или ошибку
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
