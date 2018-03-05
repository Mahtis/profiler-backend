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

const Question = sequelize.define('question', {
    id: {
        primaryKey: true,
        type: Sequelize.BIGINT
    },
    text: { type: Sequelize.STRING }
},
{
    tableName: 'question',
    timestamps: false
})

const ProfileQuestion = sequelize.define('profile_question', {
    id: {
        primaryKey: true,
        type: Sequelize.BIGINT
    },
    profile_id: { type: Sequelize.BIGINT },
    question_id: { type: Sequelize.BIGINT },
    correct_response: { type: Sequelize.BIGINT }
},
{
    tableName: 'profile_question',
    timestamps: false
})

const Response = sequelize.define('response', {
    id: {
        primaryKey: true,
        type: Sequelize.BIGINT
    },
    response_option_id: { type: Sequelize.BIGINT },
    account_id: { type: Sequelize.BIGINT },
    profile_question_id: { type: Sequelize.BIGINT }
},
{
    tableName: 'response',
    timestamps: true
})

const ResponseOption = sequelize.define('response_option', {
    id: {
        primaryKey: true,
        type: Sequelize.BIGINT
    },
    option_value: { type: Sequelize.STRING }
})

const Account = sequelize.define('account', {
    id: {
        primaryKey: true,
        type: Sequelize.UUIDV4
    },
    name: { type: Sequelize.STRING },
    birthdate: { type: Sequelize.DATEONLY },
    email: { type: Sequelize.STRING }
})

