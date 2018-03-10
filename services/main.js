const iss = require('./iss')

exports.fetchISSData = () => {
  return iss.fetchPosition()
}
