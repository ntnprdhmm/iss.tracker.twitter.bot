const iss = require('./iss')
const countryCode = require('./countryCode')
const country = require('./country')
const tweet = require('./tweet')

let previousCountryCode = null

exports.fetchISSData = () => {
  return new Promise((resolve, reject) => {
    // start by fetching new ISS coordinates and the country code
    iss.fetchPosition()
      .then(data => countryCode.fetchCountryCode(data))
      .then(data => {
        // if there is not country code (it means that the ISS is not
        // above a country) or if the country is the same as before
        // => return only these data
        if (!data.countryCode || data.countryCode == previousCountryCode) return resolve(data)

        previousCountryCode = data.countryCode
        // if it's a new country
        // fetch more informations about it
        country.fetchCountry(data)
          .then(data => tweet.createTweet(data))
          .then(data => resolve(data))
      })
      .catch(e => reject(e))
  })
}
