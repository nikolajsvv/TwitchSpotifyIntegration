const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const refreshTokenIfNeeded = require("./refreshTokenIfNeeded");

const storeCurrentlyPlaying = async () => {
  await refreshTokenIfNeeded();

  // Read the access token from the file as a string
  const accessTokenFilePath = path.join(__dirname, "../data/access_token.txt");

  // Read the access token from the file as a string
  const accessToken = fs.readFileSync(accessTokenFilePath, "utf8");

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
          const songName =
            bodyObject.item && bodyObject.item.name
              ? bodyObject.item.name
              : "No Song Playing";
          const artist =
            bodyObject.item && bodyObject.item.artists.length > 0
              ? bodyObject.item.artists[0].name
              : "Unknown Artist";

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
