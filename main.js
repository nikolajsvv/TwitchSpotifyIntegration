const { spawn } = require("node:child_process");

const spotifyServer = spawn("node", ["spotify_api_server.js"]);
const twitchBot = spawn("node", ["twitch_chat_bot.js"]);

spotifyServer.stdout.on("data", (data) => {
  console.log(`Spotify Server: ${data}`);
});

twitchBot.stdout.on("data", (data) => {
  console.log(`Twitch Bot: ${data}`);
});

spotifyServer.stderr.on("data", (data) => {
  console.error(`Spotify Server Error: ${data}`);
});

twitchBot.stderr.on("data", (data) => {
  console.error(`Twitch Bot Error: ${data}`);
});
