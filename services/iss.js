const fetch = require('node-fetch')

exports.fetchPosition = () => {
  return new Promise((resolve, reject) => {
    fetch('http://api.open-notify.org/iss-now.json')
      .then(res => res.json())
      .then(json => resolve(json.iss_position))
      //.then(json => resolve({latitude: 48.864716, longitude: 2.349014}))
      .catch(e => {
        console.log("Failed to fetch ISS position")
        reject(e)
      })
  })
}
