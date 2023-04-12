const fs = require("fs");
const path = require("path");

const refreshTokenIfNeeded = () => {
  const expirationFilePath = path.join(
    __dirname,
    "../data/token_expiration.txt"
  );

  // Create the file with a default value if it does not exist
  if (!fs.existsSync(expirationFilePath)) {
    fs.writeFileSync(expirationFilePath, "0");
  }

  const expirationTime = parseInt(fs.readFileSync(expirationFilePath, "utf8"));

  if (Date.now() > expirationTime) {
    // Read the refresh token from the file as a string
    const refreshToken = fs.readFileSync("../data/refresh_token.txt", "utf8");

    axios({
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
    }).then((response) => {
      const { access_token, expires_in } = response.data
        .then((response) => {
          const { access_token, expires_in } = response.data;
          accessToken = access_token;

          // Update the access token and expiration time
          fs.writeFileSync("../data/access_token.txt", access_token);
          const expirationTime = Date.now() + (expires_in - 60) * 1000;
          fs.writeFileSync("../data/token_expiration.txt", expirationTime);
        })
        .catch((error) => {
          console.error("Error refreshing access token:", error);
        });
    });
  }
};

module.exports = refreshTokenIfNeeded;
