function GetConfig() {
    return {
        PORT: process.env.PORT,
        SECRET: process.env.SECRET,
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        NATS_URL: process.env.NATS_URL,
    }
}

module.exports = GetConfig
