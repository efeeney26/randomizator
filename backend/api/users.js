const express = require('express');
const { sample } = require('lodash')

const User = require('../models/User');

const router = express.Router()

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => console.error(err))
})

router.post('/', (req, res) => {
    const currentUser = req.body.currentUser
    User.find( {
        $and: [
                { '_id': { $ne: currentUser['_id'] } },
                { 'giftFrom': '' }
        ]
    }).exec()
        .then((sideUsers) => {
            if (sideUsers.length) {
                const randomSideUser = sample(sideUsers)
                res.send({
                    user: randomSideUser
                })
            }
        })
        .catch(e => console.error(e))
})
module.exports = router
