const fetch = require('node-fetch')

exports.fetchPosition = () => {
  return new Promise((resolve, reject) => {
    fetch('http://api.open-notify.org/iss-now.json')
      .then(res => res.json())
      .then(json => resolve(json.iss_position))
      .catch(e => {
        console.log("Failed to fetch ISS position: " + e)
        reject(e)
      })
  })
}
