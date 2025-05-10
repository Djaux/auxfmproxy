const express = require("express");
const axios = require("axios");

const app = express();

app.get("/proxy-stream", async (req, res) => {
  try {
    const stream = await axios.get("http://uk3freenew.listen2myradio.com:7715/stream", {
      responseType: "stream",
      timeout: 120000,
      headers: {
        "Icy-MetaData": "1",
        "User-Agent": "WinampMPEG/5.09"
      }
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // завершение соединения при отключении клиента
    req.on("close", () => {
      if (stream && stream.data) stream.data.destroy();
    });

    stream.data.pipe(res);
  } catch (e) {
    console.error("Ошибка при подключении к Icecast:", e.message);
    if (!res.headersSent) {
      res.status(500).send("Ошибка при получении потока.");
    }
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
