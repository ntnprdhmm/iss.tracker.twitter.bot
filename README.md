# iss.tracker.twitter.bot

Track the International Space Station position and create a new Tweet each time the ISS is a above a new country.
The client shows a map with the current position of the ISS and a timeline with the last tweets.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js

### Installing

#### Install dependencies
```
npm install
```

#### Set env variables
First, you need to create a Twitter account.
Then, create a new Twitter app.

Create a **.env** file at the root of the projet and copy/past the following credentials in it:
```
CONSUMER_KEY=your_consumer_key
CONSUMER_KEY_SECRET=your_consumer_key_secret
TOKEN=your_token
TOKEN_SECRET=your_token_secret
```

*You can rename .env.example to .env instead of creating a new file*

#### Run project
```
npm start
```

## Built With

* [Node.js](https://nodejs.org/en/)
* [Express.js](http://expressjs.com/fr/)
* [Socket.io](https://socket.io/)

## Authors

* **Antoine Prudhomme** - [prudywsh](https://github.com/prudywsh)
* **Vincent Rajau** - *Worked on the first version* - [vrajau](https://github.com/vrajau)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
