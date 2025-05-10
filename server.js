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
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Accept": "*/*"
    }
  };

  const proxyReq = http.get(options, (streamRes) => {
    // важные заголовки, чтобы браузер нормально прочёл поток
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Connection": "keep-alive",
      "Transfer-Encoding": "chunked",
      "Accept-Ranges": "none",
      "Access-Control-Allow-Origin": "*"
    });

    streamRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Ошибка при подключении к Icecast:", err.message);
    if (!res.headersSent) {
      res.status(500).send("Не удалось подключиться к потоку.");
    }
  });

  req.on("close", () => {
    proxyReq.destroy(); // клиент ушёл — закрываем
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy is running on port " + (process.env.PORT || 3000));
});
