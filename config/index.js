require('dotenv').config()

module.exports = {
    SECRET: process.env.APP_SECRET,
    PORT: process.env.APP_PORT,
    DB: process.env.APP_DB,
}