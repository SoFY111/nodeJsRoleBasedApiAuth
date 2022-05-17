const User = require('../models/User')

const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { SECRET } = require('../config')


/**
 * 
 * @DESC To register the user (ADMIN, SUPERADMIN, USER)
 * 
 */
const userRegister = async (userDets, role, res) => {
    try{
        //Validate the username
        let usernameNotTaken = await(validateUsername(userDets.username))
        if(!usernameNotTaken) return res.status(400).json({
            message: `Username is already taken`,
            success: false,
        })

        //Validate the email
        let emailNotRegistered = await(validateEmail(userDets.email))
        if(!emailNotRegistered) return res.status(400).json({
            message: `Email is already taken`,
            success: false,
        })

        //Get the hashed password
        const password = await bcrypt.hash(userDets.password, 12)
        
        //create a new user
        const newUser = new User({
            ...userDets,
            password,
            role: role
        })

        await newUser.save();

        return res.status(201).json({
            message: "User is created successfuly registered. Please now login", success: false
        })

    }
    catch(err){
        //implement logger function
        return res.status(500).json({
            message: `Unable to create your account, ${err}`, success: false
        })
    }
}

/**
 * 
 * @DESC To login the user (ADMIN, SUPERADMIN, USER)
 * 
 */
const userLogin = async (userCreds, role, res) => {
    let {username, password} = userCreds
    //first check if the username is in the db
    const user = await User.findOne({ username });
    if(!user) return res.status(404).json({
        message: 'Username is not found. Invalid login credentials',
        success: false
    })

    //we will check the role
    if(user.role != role) return res.status(404).json({
        message: 'Please make sure you are loggin in from right portal',
        success: false
    })

    //that means user is existing and trying to signin from right portal
    //now check for the password

    let isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(404).json({
        message: 'Incorrect password.',
        success: false
    }) 

    let token = jwt.sign(
        {
            user_id: user._id, 
            role: user.role, 
            username: user.username,
            email: user.email
        }, 
        SECRET,
        { expiresIn: "7 days" }
    )

    let result = {
        username: user.username,
        role: user.role,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 168
    }

    return res.status(200).json({
        ...result,
        message: "You are now logged in.",
        success: true
    })

}

const validateUsername = async (username) => {
    let user = await User.findOne({ username })
    return user ? false : true
}

/**
 * 
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) => !roles.includes(req.user.role) ? res.status(404).json("Unauthorized") : next()


/**
 * 
 * @DESC PASSPORT MIDDLEWARE
 */

const userAuth = passport.authenticate('jwt', {session: false})

const validateEmail = async (email) => {
    let user = await User.findOne({ email })
    return user ? false : true
}

const serializeUser = user => {
    return {
        username: user.username,
        email: user.email,
        _id: user._id,
        name: user.name,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
    }
}

module.exports = {
    userAuth,
    userRegister,
    userLogin,
    serializeUser,
    checkRole
}