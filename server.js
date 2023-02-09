require("dotenv").config();
const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const fs = require("fs");
const app = express();
const open = require("open");

const PORT = process.env.PORT || 8888;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const generateRandomString = require("./functions/generateRandomString");

const stateKey = "spotify_auth_state";
let accessToken;

// Login endpoint
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope =
    "user-read-private user-read-email user-read-playback-state user-read-currently-playing";

  const queryParams = querystring.stringify({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Callback endpoint
app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, token_type } = response.data;

        axios
          .get("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: `${token_type} ${access_token}`,
            },
          })
          .then((response) => {
            // Store the data for callback use
            const displayName = response.data.display_name;
            const email = response.data.email;
            const imageUrl = response.data.images[0].url;
            res.send(`
            <html>
              <head>
                <style>
                  .body {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    height: 100%;
                  }
                  .portrait {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    width: 200px;
                    border-radius: 100px;
                    overflow: hidden;
                  }
                  .info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                  }
                </style>
              </head>
              <body class="body">
                <div>
                  <div class="portrait">
                    <img src="${imageUrl}" alt="User's profile image" />
                  </div>
                  <div class="info">
                    <h2>${displayName}</h2>
                    <p>${email}</p>
                  </div>
                </div>
                <div>
                  <p>You have successfully logged into Spotify.</p>
                </div>
              </body>
            </html>
            `);
            accessToken = access_token;
          })
          .catch((error) => {
            res.send(error);
          });
      } else {
        res.send(response);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

// Endpoint to generate a refresh token instead of having to re-login
app.get("/refresh_token", (req, res) => {
  const { refresh_token } = req.query;
  const code = req.query.code || null;

  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
      res.locals.refresh_token = refresh_token;
      fs.writeFileSync("../data/refresh_token.txt", refresh_token);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/nowplaying", (req, res) => {
  axios
    .get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(PORT, (req, res) => {
  console.log(`Spotfiy API listening on http://localhost:${PORT}`);
  // Open the browser to the login URL after the server has started
  open("http://localhost:8888/login");
});
