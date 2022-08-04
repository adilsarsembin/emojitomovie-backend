const Router = require('express')
const router = new Router()
const controller = require('./controllers/authController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewares/authMiddleware')

router.post('/registration', [
    check('username', "Username field can't be empty!").notEmpty(),
    check('password', "Password field must contain from 4 to 20 characters!").isLength({min: 4, max: 20})
], controller.registration)
router.post('/login', controller.login)
router.get('/check', authMiddleware, controller.check)
router.put('/score', controller.scoreUpdate)
router.get('/leaderboard', controller.leaderboard)

module.exports = router;