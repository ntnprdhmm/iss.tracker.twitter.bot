require('dotenv').config()

const express = require('express')
const path = require('path')
const bodyParser = require("body-parser")
const tweetHelper = require('./helpers/tweet')
const main = require('./services/main')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
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

io.on('connection', (socket) => {
  console.log('a user connected')
})

// FETCH NEW DATA EVERY 3 SECONDS
setInterval(_ => {
	main.fetchISSData()
		.then(data => {
			console.log(data)
			io.sockets.emit('data', data)
		})
		.catch(e => console.log(e))
}, 3000)

// RUN SERVER
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
