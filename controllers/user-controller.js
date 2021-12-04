const User = require('../models/user')
const { sample } = require("lodash");

exports.users_length_list = async (req, res) => {
    try {
        const [usersLength, usersWithoutGiftLength] = await Promise.all([
            await User.countDocuments(),
            await User.countDocuments({ giftFrom: '' })
        ])
        res.send({
            usersLength,
            usersWithoutGiftLength
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: err })
    }
}

exports.get_random_user_without_gift = (req, res) => {
    const {
        body: {
            currentUser
        }
    } = req
    User.find( {
        $and: [
            { '_id': { $ne: currentUser } },
            { $or: [
                    { 'giftTo': '', 'giftFrom': ''},
                    { 'giftFrom': '' }
                ]}
        ]
    }).exec()
        .then((sideUsers) => {
            if (sideUsers.length) {
                const randomSideUser = sample(sideUsers)
                User.updateOne({ '_id': currentUser }, { 'giftTo': randomSideUser.name })
                    .then(() => {
                        User.updateOne({ '_id': randomSideUser }, { 'giftFrom': currentUser.name })
                            .then(() => {
                                res.send({
                                    user: randomSideUser
                                })
                            })
                    })
            } else {
                res.send({
                    message: 'Поздравлять некого - все с подарками'
                })
            }
        })
        .catch(e => console.error(e))
}

exports.clear_data = (req, res) => {
    User.updateMany({}, {
        $set: {
            'giftTo': '',
            'giftFrom': ''
        }
    }).then(() => {
            res.send({
                message: 'Данные очищены'
            })
        })
}

exports.add_user = async (req, res) => {
    const {
        body: {
            name
        }
    } = req
    const newUser = {
        name,
        giftTo: '',
        giftFrom: ''
    }
    try {
        await User.create(newUser)
        res.send({
            message: 'Пользователь создан'
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: err })
    }
}
