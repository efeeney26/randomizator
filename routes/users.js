const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router
    .get('/', userController.users_length_list )
    .post('/user', userController.get_random_user_without_gift)
    .put('/clear', userController.clear_data)
    .post('/add', userController.add_user)

module.exports = router
