const fetch = require('node-fetch')

exports.fetchCountry = (data) => {
  return new Promise((resolve, reject) => {

    // if no country code, dont fetch
    if (!data.countryCode) {
      return resolve(data)
    }

    fetch(`https://restcountries.eu/rest/v2/alpha/${data.countryCode.toLowerCase()}`)
      .then(res => res.json())
      .then(json => {
        data.countryName = json.nativeName
        data.languageCode = json.languages[0][Object.keys(json.languages[0])[0]]
        resolve(data)
      })
      .catch(e => {
        console.log("Failed to fetch country from country code.")
        reject(e)
      })
  })
}
