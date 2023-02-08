# Twitch Chat Spotify Bot

A Node.js application that allows users to link their Twitch account with their Spotify account, allowing for their currently playing song on Spotify to be displayed in their Twitch chat.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have the following installed on your local machine:

- Node.js
- npm

### Installing

1. Clone the repository to your local machine

   `git clone https://github.com/nikolajsvv/twitch-chat-spotify-bot.git`

2. Navigate to the directory where the repository was cloned

   `cd twitch-chat-spotify-bot`

3. Install the required packages

   `npm install`

4. Create a `.env` file in the root directory with the following information:

- Spotify API credentials - [information below](#setting-up-spotify-api)

```
  SPOTIFY_CLIENT_ID=your_client_id
  SPOTIFY_CLIENT_SECRET=your_client_secret
  REDIRECT_URI=http://localhost:8888/callback
```

- Twitch API credentials - [information below](#setting-up-twitch-api)

```
  TWITCH_OAUTH=your_twitch_oauth_token
  TWITCH_CLIENT_ID=your_client_id
  TWITCH_CHANNEL=your_channel
  TWITCH_USERNAME=your_twitch_username
  TWITCH_CLIENT_SECRET=your_client_secret
```

5. Start the server

   `npm start server`

6. Login to authorize Spotify API by going to

   `localhost:8888/login`

7. Once logged in, start the application

   `npm start`

## Setting up Spotify API

1. Go to https://developer.spotify.com/dashboard/ and login to your Spotify account.
2. Click `Create An App`.
3. Fill out App Name and Description.
4. Click `Edit settings`.
5. Add the link `http://localhost:8888/callback` to the Redirect URI and click Save.
6. Copy/Paste the Client ID and Client Secret to your .env file.

## Setting up Twitch API

1. Go to https://dev.twitch.tv/ and login to your Twitch account.
2. Click `Your Console` in the top right corner.
3. Click `Applications` and Register a new application.
4. Fill out the `Name` and set the OAuth redirect URL to `http://localhost:3000`.
5. Copy/Paste the Client ID to your .env file.
6. Go to https://twitchapps.com/tmi/ and authorize your Twitch account.
7. Once authorized, add the code to `TWITCH_OAUTH` in your .env file.

## Built With

- [Node.js](https://nodejs.org/) - The JavaScript runtime
- [npm](https://www.npmjs.com/) - Package manager for JavaScript

## Contributing

If you would like to contribute to the project, please create a pull request with a detailed explanation of your changes.

## Authors

- [Nikolajs Veidis](https://github.com/[nikolajsvv])

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.
