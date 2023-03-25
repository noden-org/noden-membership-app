const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')

// Init cache
let cache = apicache.middleware

router.get('/', cache('2 minutes'), async (req, res) => {

    try {
        const apiRes = await needle('get',
            'https://api.moonclerk.com/customers',
            {
                headers: {
                    'Authorization': `Token token=${process.env.MOONCLERK_API_KEY}`,
                    'Accept': 'application/vnd.moonclerk+json;version=1'
                }
            }
        )

        const data = apiRes.body

        res.status(200).json({ "todo": true })
    }
    catch (error) {
        res.status(500).json({ error })
    }

})

module.exports = router