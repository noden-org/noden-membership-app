const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

require('dotenv').config()

const PORT = process.env.PORT || 5100

const app = express()

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 50
})

app.use(limiter)
app.set('trust proxy', 1)
app.use(express.static('public'))
app.use('/api', require('./routes/routes.js'))
app.use(cors())

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))