const fetch = require('node-fetch')

exports.fetchCountryCode = data => {
  const parameters = `lat=${parseFloat(data.latitude)}&lng=${parseFloat(data.longitude)}&username=iss_utt_bot`
  return new Promise((resolve, reject) => {
    fetch(`http://api.geonames.org/findNearbyPostalCodesJSON?${parameters}`)
      .then(res => res.json())
      .then(json => {
        if (json.postalCodes[0]) {
          data.countryCode = json.postalCodes[0].countryCode
        }
        resolve(data)
      })
      .catch(e => {
        console.log("Failed to fetch contry code")
        reject(e)
      })
  })
}
