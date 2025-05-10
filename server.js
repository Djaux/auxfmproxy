const http = require("http");
const express = require("express");

const app = express();

app.get("/proxy-stream", (req, res) => {
  const options = {
    hostname: "uk3freenew.listen2myradio.com",
    port: 7715,
    path: "/stream",
    headers: {
      "Icy-MetaData": "1",
      "User-Agent": "WinampMPEG/5.09"
    }
  };

  const proxyReq = http.get(options, (streamRes) => {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");

    streamRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Ошибка при подключении к Icecast:", err.message);
    res.status(500).send("Не удалось подключиться к потоку.");
  });

  req.on("close", () => {
    proxyReq.destroy(); // если клиент уходит — закрываем
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
