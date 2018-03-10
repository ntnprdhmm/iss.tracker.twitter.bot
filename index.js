require('dotenv').config()

const express = require('express')
const path = require('path')
const bodyParser = require("body-parser")
const Twitter = require('twitter')
const tweetHelper = require('./helpers/tweet')

const app = express()
const client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_KEY_SECRET,
	access_token_key: process.env.TOKEN,
	access_token_secret: process.env.TOKEN_SECRET
})
const apiRouter = express.Router()

const PORT = 3000
const countryCodeRegex = new RegExp(/^[a-z]{2}$/i);

// MIDDLEWARES

//  parse body request
app.use(bodyParser.json())
// use /public in html files
app.use(express.static('public'))
// api root
app.use('/api', apiRouter)
// check if the country code has the right format
apiRouter.use('/tweet/:countryCode', (req, res, next) => {
	req.params.countryCode.match(countryCodeRegex) ? next() : res.status(400).send("Wrong country code")
})

// ROUTES

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/index.html'))
})

apiRouter.get('/', (req,res) => {
	res.json({
		format: 'application/json',
		action: 'GET',
		baseUrl: 'http://www.uttissbot.com/api',
		endpoints: {
			tweet: '/tweet',
			tweetcc: '/tweet/{countryCode}'
		}
	})
})

// Route to get all tweet or post a tweet
apiRouter.route('/tweet')
	.post((req, res, next) => {
		client.post('statuses/update', {
		 	status: req.body.status,
		 	lat: req.body.lat,
		 	long: req.body.lng,
		 	display_coordinates: true
		}, e => {
		 	console.log(e)
	 	})
	})
 	.get((req, res, next) => {
	 	client.get('statuses/user_timeline', (req, tweets, resp) => {
			res.json(tweetHelper.buildTweets(tweets))
		})
 	})

// RUN SERVER
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
