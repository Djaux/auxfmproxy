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
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Обрыв по уходу клиента
    req.on("close", () => {
      stream.data.destroy();
    });

    stream.data.pipe(res);
  } catch (e) {
    console.error("Ошибка:", e.message);
    res.status(500).send("Поток не доступен.");
  }
});
