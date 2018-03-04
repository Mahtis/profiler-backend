const Sequelize = require('sequelize')

const sequelize = new Sequelize('profiler')

const Profile = sequelize.define('profile', {
    id: {
        primaryKey: true,
        type: Sequelize.BIGINT
    },
    account_id: { type: Sequelize.BIGINT },
    active: { type: Sequelize.BOOLEAN },
    picture: { type: Sequelize.BLOB },
},
{
    tableName: 'profile',
    timestamps: true
})

const Question

const ProfileQuestion

const Response

const ResponseOption

const Account

