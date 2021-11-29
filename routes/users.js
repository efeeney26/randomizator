const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router
    .get('/', userController.user_list)
    .post('/user', userController.get_user_without_gift)
    .put('/clear', userController.clear_data)

module.exports = router
