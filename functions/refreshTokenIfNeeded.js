require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const querystring = require("querystring");

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const refreshTokenIfNeeded = async () => {
  const expirationFilePath = path.join(
    __dirname,
    "../data/token_expiration.txt"
  );

  const refreshTokenFilePath = path.join(
    __dirname,
    "../data/refresh_token.txt"
  );

  // Create the file with a default value if it does not exist
  if (!fs.existsSync(expirationFilePath)) {
    fs.writeFileSync(expirationFilePath, "0");
  }

  const expirationTime = parseInt(fs.readFileSync(expirationFilePath, "utf8"));

  if (Date.now() >= expirationTime) {
    // Read the refresh token from the file as a string
    const refreshToken = fs.readFileSync(refreshTokenFilePath).toString();
    try {
      const respone = await axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        data: querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${new Buffer.from(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      });
      const { access_token, token_type, expires_in } = response.data;
      const expirationTime = Date.now() + (expires_in - 60) * 1000;
      fs.writeFileSync(
        "../data/token_expiration.txt",
        expirationTime.toString()
      );
      accessToken = access_token;
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = refreshTokenIfNeeded;
