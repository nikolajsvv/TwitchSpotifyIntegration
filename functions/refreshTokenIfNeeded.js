const axios = require("axios");
const fs = require("fs");
const path = require("path");

const refreshTokenIfNeeded = async () => {
  const tokenExpirationPath = path.join(
    __dirname,
    "../data/token_expiration.txt"
  );
  const refreshTokenPath = path.join(__dirname, "../data/refresh_token.txt");
  const accessTokenPath = path.join(__dirname, "../data/access_token.txt");
  const expirationTime = fs.readFileSync(tokenExpirationPath);
  const refreshToken = fs.readFileSync(refreshTokenPath);
  if (Date.now().toString() >= expirationTime) {
    try {
      const response = await axios.get(
        `http://localhost:8888/refresh_token?refresh_token=${refreshToken.toString()}`
      );

      const newAccessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      fs.writeFileSync(accessTokenPath, newAccessToken.toString());
      fs.writeFileSync(
        tokenExpirationPath,
        (Date.now() + expiresIn * 1000).toString()
      );
      console.log(`Successfully updated access_token and expires_in`);
    } catch (error) {
      console.error("Failed to refresh access token", error);
    }
  }
};

module.exports = refreshTokenIfNeeded;
