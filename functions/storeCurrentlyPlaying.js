const http = require("http");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const storeCurrentlyPlaying = () => {
  http.get("http://localhost:8888/nowplaying", (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      if (data === "") {
        console.log("Nothing playing...");
        return;
      }
      const $ = cheerio.load(data);
      const body = $("pre").text();
      const bodyObject = JSON.parse(body);
      const songName = bodyObject.item.name;
      const artist = bodyObject.item.artists[0].name;
      const songInfo = `${songName} by ${artist}`;

      fs.writeFileSync(path.join(__dirname, "../data/song.txt"), songInfo);
    });
  });
};

module.exports = storeCurrentlyPlaying;
