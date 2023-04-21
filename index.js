require("dotenv").config();
const tmi = require("tmi.js");
const http = require("http");
const cheerio = require("cheerio");

const storeCurrentlyPlaying = require("./functions/storeCurrentlyPlaying");

const TWITCH_USERNAME = process.env.TWITCH_USERNAME;
const TWITCH_OAUTH = process.env.TWITCH_OAUTH;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL;

// Create a Twitch client
const client = new tmi.Client({
  options: { debug: true, messageLogLevel: "debug" },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: `${TWITCH_USERNAME}`,
    password: `${TWITCH_OAUTH}`,
  },
  channels: [`${TWITCH_CHANNEL}`],
});

// Connect to Twitch
client.connect().catch((error) => {
  console.error(error);
});

// Listens for messages in Twitch chat and responds based on commands
client.on("message", (channel, tags, message, self) => {
  if (self) return;
  // Switch case to check for commands
  switch (message.toLowerCase()) {
    case "!commands":
      client.say(
        channel,
        `@${tags.username}, the available commands are: 
        !song`
      );
      break;
    // Responds with currently playing song from /nowplaying endpoint
    case "!song":
      http.get("http://localhost:8888/nowplaying", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const $ = cheerio.load(data);
          const body = $("pre").text();
          const bodyObject = JSON.parse(body);
          const songLink = bodyObject.item.external_urls.spotify;
          const songName = bodyObject.item.name;
          const artist = bodyObject.item.artists[0].name;

          client.say(
            channel,
            `@${tags.username}, you are listening to ${songName} by ${artist}. Spotify Link: ${songLink}`
          );
        });
      });
      break;
  }
});

setInterval(storeCurrentlyPlaying, 10000);
