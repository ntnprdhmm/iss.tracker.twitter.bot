const formatTweet = tweet => {
  return {
    time: tweet.created_at,
    text: tweet.text,
    url: `https://twitter.com/ISS_bot_tracker/status/${tweet.id_str}`,
    geo: {
      lat: tweet.coordinates.coordinates[0],
      lng: tweet.coordinates.coordinates[1],
      city: tweet.place ? tweet.place.name : "",
      country: tweet.place ? tweet.place.country : "",
      country_code: tweet.place ? tweet.place.country_code : ""
    }
  }
}

exports.formatTweet = tweet => formatTweet(tweet)
exports.formatTweets = tweets => tweets.map(tweet => formatTweet(tweet))
