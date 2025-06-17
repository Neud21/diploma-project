const express = require('express')
const cors = require('cors')
const http = require('http')
const GetConfig = require('./config/index')
const authRouter = require('./routers/authRouter')
const restaurantRouter = require('./routers/restaurantRouter')
const deliveryRouter = require('./routers/deliveryRouter')
const imageRouter = require('./routers/imageRouter')
const userRouter = require('./routers/userRouter')
const { sequelize } = require('./models')

// Get the required config
const { PORT } = GetConfig()

// Setting app and allowing cors
const app = express()
app.use(express.json())
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['*'],
    }),
)

// Initializing server
const server = http.createServer(app)

// Register auth router
app.use('/auth', authRouter)
app.use('/restaurant', restaurantRouter)
app.use('/delivery', deliveryRouter)
app.use('/order', userRouter)
app.use('/images', imageRouter)

const start = async () => {
    try {
        // Connecting to database
        await sequelize.authenticate()
        console.log('Connected to database')

        await sequelize.sync({ alter: true })

        // Starting HTTP server
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        // Catching error
        console.error('start server error:', e)
    }
}
app.use(
    '/uploads',
    express.static('uploads', {
        maxAge: '30d', // Кеширование на 30 дней
        setHeaders: (res, path) => {
            if (path.endsWith('.jpg')) {
                res.set('Content-Type', 'image/jpeg')
            }
        },
    }),
)

start()
