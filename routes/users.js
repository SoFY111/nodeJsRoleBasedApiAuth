const { append } = require('express/lib/response');

const router = require('express').Router()

//bring in the UserRegistration Function
const {userRegister, userLogin, userAuth, serializeUser, checkRole} = require('../utils/Auth')

//Users Registration Route
router.post('/register-user', async (req, res) => {
    await userRegister(req.body, 'user', res)
})

//Admin Registration Route
router.post('/register-admin', async (req, res) => {
    await userRegister(req.body, 'admin', res)
})

//SuperAdmin Registration Route
router.post('/register-super-admin', async (req, res) => {
    await userRegister(req.body, 'superadmin', res)
})


//Users Login Route
router.post('/login-user', async (req, res) => {
    await userLogin(req.body, 'user', res);
})

//Admin Login Route
router.post('/login-admin', async (req, res) => {
    await userLogin(req.body, 'admin', res);
})

//SuperAdmin Login Route
router.post('/login-super-admin', async (req, res) => {
    await userLogin(req.body, 'superadmin', res);
})

//Profile Route
router.get('/profile', userAuth, async (req, res) => {
    return res.json(serializeUser(req.user))
})


//Users Protected Route
router.get('/user-protected', userAuth, checkRole(['users']), async (req, res) => {
    return res.json("hello user")
})

//Admin Protected Route
router.get('/admin-protected', userAuth, checkRole(['admin']), async (req, res) => {
    return res.json("hello admin")
})

//SuperAdmin Protected Route
router.get('/super-admin-protected', userAuth, checkRole(['superadmin']), async (req, res) => {
    return res.json("hello super admin")
})

//SuperAdmin Protected Route
router.get('/super-admin-and-admin-protected', userAuth, checkRole(['superadmin', 'admin']), async (req, res) => {})

module.exports = router;