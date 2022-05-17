const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const { connect } =  require('mongoose')
const { success, error } = require('consola')

const userRoutes = require('./routes/users')

//Bring in the app constans
const {DB, PORT } = require('./config');

const app = express();

//Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())

require('./middlewares/passport')(passport)

//USER ROUTER
app.use('/api/users', userRoutes)

const startApp = async () => {
    try {
        //connect db
        await connect(DB, {  useUnifiedTopology: true, useNewUrlParser: true  })

        success({message: `Connected to DB ${DB}`, badge: true})

        app.listen(PORT, (e) => {
            if(e) error({message: `${e}`, badge: true})
            success({message: `Server started on PORT ${PORT}`, badge: true})
        })   
    } catch (err) {
        error({message: `Unable to connect with Database ${err}`, badge: true})
    }
}

//initialize app
startApp()