const Twitter = require('twitter')
const settings = require('../config/settings')
const tweetHelper = require('../helpers/tweet')

const client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_KEY_SECRET,
	access_token_key: process.env.TOKEN,
	access_token_secret: process.env.TOKEN_SECRET
})

exports.createTweet = data => {
  return new Promise((resolve, reject) => {
    const body = {
      status: settings.message(data.countryName),
      lat: data.latitude,
      long: data.longitude,
      display_coordinates: true
    }
    client.post('statuses/update', body)
      .then(tweet => tweet ? tweetHelper.formatTweet(tweet) : null)
			.then(tweet => {
				data.tweet = tweet
				resolve(data)
			})
      .catch(e => {
        console.log("Failed to create tweet.")
				console.log(e)
        reject(e)
      })
  })
}

exports.fetchTweets = () => {
  return new Promise((resolve, reject) => {
    client.get('statuses/user_timeline')
      .then(res => {
        console.log(res)
        //tweetHelper.formatTweets(tweets)
        resolve(res)
      })
      .catch(e => {
        console.log("Failed to fetch tweets")
        reject(e)
      })
  })
}
