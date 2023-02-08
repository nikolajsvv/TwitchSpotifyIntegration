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

   `git clone https://github.com/[username]/TwitchSpotifyBot.git`

2. Navigate to the directory where the repository was cloned

   `cd TwitchSpotifyBot`

3. Install the required packages

   `npm install`

4. Create a `.env` file in the root directory with the following information:

- Spotify API credentials

```
  SPOTIFY_CLIENT_ID=your_client_id
  SPOTIFY_CLIENT_SECRET=your_client_secret
  SPOTIFY_REDIRECT_URI=your_redirect_uri
```

- Twitch API credentials

```
  TWITCH_CLIENT_ID=your_client_id
  TWITCH_CLIENT_SECRET=your_client_secret
```

5. Start the server

   `npm start server`

6. Login to authorize Spotify API by going to

   `localhost:8888/login`

7. Once logged in, start the application

   `npm start`

## Built With

- [Node.js](https://nodejs.org/) - The JavaScript runtime
- [npm](https://www.npmjs.com/) - Package manager for JavaScript

## Contributing

If you would like to contribute to the project, please create a pull request with a detailed explanation of your changes.

## Authors

- [Nikolajs Veidis](https://github.com/[nikolajsvv])

## License

This project is licensed under the [Your License Name] license - see the [LICENSE.md](LICENSE.md) file for details.
