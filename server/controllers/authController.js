const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const GetConfig = require('../config/index')

const { SECRET } = GetConfig()

const generateAccessToken = (id, login, role) => {
    const payload = {
        id,
        login,
        role,
    }
    return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Error in registration.',
                    errors,
                })
            }

            const { login, password, role } = req.body

            if (!login || !password) {
                return res
                    .status(400)
                    .json({ message: 'Login or Password are required.' })
            }

            if (role === '') role = 'USER'

            const candidate = await User.findOne({ where: { login } })
            if (candidate) {
                return res.status(400).json({ message: 'User already exists.' })
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({
                login: login,
                password: hashPassword,
                role: role,
            })

            const token = generateAccessToken(user.id, user.login, user.role)
            return res.status(201).json({
                message: 'User successfully created.',
                token,
                username: user.login,
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: 'Registration error.' })
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body

            if (!login || !password) {
                return res
                    .status(400)
                    .json({ message: 'Login or Password are required.' })
            }

            const user = await User.findOne({ where: { login } })
            if (!user) {
                return res.status(400).json({ message: 'User doesnt exist.' })
            }

            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Uncorrect password.' })
            }

            const token = generateAccessToken(user.id, user.login, user.role)
            return res.status(200).json({
                token: token,
                username: user.login,
                user_role: user.role,
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: 'Login error.' })
        }
    }
}

module.exports = new authController()
