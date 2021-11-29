const User = require('../models/user')
const {sample} = require("lodash");

exports.user_list = async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: err })
    }
}

exports.get_user_without_gift = (req, res) => {
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
