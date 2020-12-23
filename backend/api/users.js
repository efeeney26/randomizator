const express = require('express');
const router = express.Router()

const User = require('../models/User');

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => console.error(err))
})

router.post('/', (req, res) => {
    const { name } = req.body;
    User.findOne( { name }).exec()
        .then((user) => {
            if (user) {
                let id = randomInteger(1, 4)
                while (id === user.id) {
                    id = randomInteger(1, 4)
                }
                User.findOne( { id }).exec()
                    .then((user) => {
                        res.send({
                            user
                        })
                    })
            } else {
                res.send({
                    message: 'Нет такого'
                })
            }
        })
        .catch((e) => console.error(e))
})
module.exports = router
