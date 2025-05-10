const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/stream-url", async (req, res) => {
  try {
    const response = await axios.get("https://auxfmua.radio12345.com/", {
      headers: { "User-Agent": "Mozilla/5.0" },
      responseType: "text"
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const mp3link = $("#urladdress").text().trim();

    if (mp3link && mp3link.startsWith("http")) {
      return res.redirect(mp3link); // 🔁 редиректим на mp3!
    } else {
      res.status(404).send("Stream link not found");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Internal server error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
