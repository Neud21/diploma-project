const jwt = require('jsonwebtoken')
const GetConfig = require('../config/index')

const { SECRET } = GetConfig()

// This function checks the authenticity of the user and verifying jwt
module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({ message: 'You are not authorized' })
        }
        const decodedData = jwt.verify(token, SECRET)
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: 'You are not authorized' })
    }
}
