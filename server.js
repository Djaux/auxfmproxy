const express = require("express");
const axios = require("axios");

const app = express();

app.get("/proxy-stream", async (req, res) => {
  try {
    const response = await axios.get("http://uk3freenew.listen2myradio.com:7715/stream", {
      responseType: "stream",
      headers: {
        "Icy-MetaData": "1",
        "User-Agent": "WinampMPEG/5.09"
      },
      timeout: 120000
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Если клиент закрыл соединение — завершаем
    req.on("close", () => {
      if (response.data && response.data.destroy) {
        response.data.destroy();
      }
    });

    response.data.pipe(res);

  } catch (error) {
    console.error("Ошибка при подключении к потоку:", error.message);
    res.status(500).send("Не удалось подключиться к потоку.");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
