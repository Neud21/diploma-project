const jwt = require('jsonwebtoken')
const GetConfig = require('../config/index')

const { SECRET } = GetConfig()

// const allowedRoles = ['ADMIN', 'USER']

// This function checks user access
module.exports = function (requiredRoles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token) {
                return res.status(403).json({ message: 'Miss token.' })
            }

            const { role } = jwt.verify(token, SECRET)

            // if (role !== requiredRoles) {
            //     return res
            //         .status(403)
            //         .json({ message: "You don't have access" })
            // }

            const isApplicable = requiredRoles.includes(role)

            if (!isApplicable) {
                return res
                    .status(403)
                    .json({ message: 'Your role is unknown.' })
            }

            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: 'User is not authorized' })
        }
    }
}
