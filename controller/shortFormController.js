const fs = require("fs");
exports.loadViedo = (req, res) => {
  let range = req.headers.range;
  if (!range) {
    range = "1023";
  }

  const videoPath = req.params.videoPath;
  const videoSize = fs.statSync(videoPath).size;
  console.log(videoPath);

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  console.log(videoSize);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
}

exports.getVideoList = (req, res) => {
  fs.readdir('../uploads', (err, files) => {
    if (err) {
        console.error('파일 목록 읽는 중 오류:', err);
        res.status(500).send("오류");
        return;
    }
    const items = [];
    for(let i; i < files.length; i++) {
      items.push({ videoPath: files[i]});
    }
    console.log(items);
    res.status(200).json(items);
  });
}
