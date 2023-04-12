const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const refreshTokenIfNeeded = require("./refreshTokenIfNeeded");

const storeCurrentlyPlaying = () => {
  refreshTokenIfNeeded();

  // Read the access token from the file as a string
  const accessTokenFilePath = path.join(__dirname, "../data/access_token.txt");

  // Create the file with a default value if it does not exist
  if (!fs.existsSync(accessTokenFilePath)) {
    fs.writeFileSync(accessTokenFilePath, "");
  }

  // Read the access token from the file as a string
  accessToken = fs.readFileSync(accessTokenFilePath, "utf8");

  http.get("http://localhost:8888/nowplaying", (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      const $ = cheerio.load(data);
      const body = $("pre").text();
      try {
        const bodyObject = JSON.parse(body);
        if (bodyObject) {
          const songName = bodyObject.item.name;
          const artist = bodyObject.item.artists[0].name;
          const songInfo = `${songName} by ${artist}`;
          const albumImgUrl = bodyObject.item.album.images[0].url;
          const songNameSpacing = `${songName}${" ".repeat(4)}`;
          fs.writeFileSync(
            path.join(__dirname, "../data/currentSong.txt"),
            songNameSpacing
          );
          fs.writeFileSync(
            path.join(__dirname, "../data/currentArtist.txt"),
            artist
          );
          fs.writeFileSync(
            path.join(__dirname, "../data/currentlyPlaying.txt"),
            songInfo
          );

          // Store the album cover image locally
          https.get(albumImgUrl, (imgRes) => {
            let imgData = [];
            imgRes.on("data", (chunk) => {
              imgData.push(chunk);
            });
            imgRes.on("end", () => {
              const finalImgData = Buffer.concat(imgData);
              fs.writeFileSync(
                path.join(__dirname, "../data/album.jpg"),
                finalImgData
              );
            });
          });
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
};

module.exports = storeCurrentlyPlaying;
