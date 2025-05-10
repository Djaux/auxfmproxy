app.get("/proxy-stream", async (req, res) => {
  try {
    const stream = await axios.get("http://uk3freenew.listen2myradio.com:7715/stream", {
      responseType: "stream"
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");

    stream.data.pipe(res);
  } catch (e) {
    console.error("Ошибка:", e.message);
    res.status(500).send("Поток не доступен.");
  }
});
