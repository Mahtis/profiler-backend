const Sequelize = require('sequelize')
const conf = require('../conf')


const sequelize = new Sequelize(conf.DB_URL)

const Profile = sequelize.define('profile', {
  id: {
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
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
    type: Sequelize.BIGINT,
    autoIncrement: true
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
    type: Sequelize.BIGINT,
    autoIncrement: true
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
    type: Sequelize.BIGINT,
    autoIncrement: true
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
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  question_id: { type: Sequelize.BIGINT },
  option_value: { type: Sequelize.STRING }
},
  {
    tableName: 'response_option',
    timestamps: false
  })

const Account = sequelize.define('account', {
  id: {
    primaryKey: true,
    type: Sequelize.UUIDV4
  },
  username: { type: Sequelize.STRING, unique: true, allowNull: false },
  password: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  birthdate: { type: Sequelize.DATEONLY },
  email: { type: Sequelize.STRING },
  role: { type: Sequelize.ENUM }
},
  {
    tableName: 'account',
    timestamps: true
  })

Profile.belongsTo(Account, { foreignKey: 'account_id', targetKey: 'id' })
Account.hasMany(Profile, { foreignKey: 'account_id', targetKey: 'id' })

Profile.hasMany(ProfileQuestion, { foreignKey: 'profile_id', targetKey: 'id' })
ProfileQuestion.belongsTo(Profile, { foreignKey: 'profile_id', targetKey: 'id' })

Question.hasMany(ProfileQuestion, { foreignKey: 'question_id', targetKey: 'id' })
ProfileQuestion.belongsTo(Question, { foreignKey: 'question_id', targetKey: 'id' })

ProfileQuestion.hasOne(ResponseOption, { foreignKey: 'correct_response', targetKey: 'id' })
ResponseOption.belongsTo(ProfileQuestion, { foreignKey: 'correct_response', targetKey: 'id' })

Profile.belongsToMany(Question, { through: ProfileQuestion })
Question.belongsToMany(Profile, { through: ProfileQuestion })

ProfileQuestion.hasMany(Response, { foreignKey: 'profile_question_id', targetKey: 'id' })
Response.belongsTo(ProfileQuestion, { foreignKey: 'profile_question_id', targetKey: 'id' })

Response.hasOne(ResponseOption, { foreignKey: 'response_option_id', targetKey: 'id' })
ResponseOption.belongsTo(Response, { foreignKey: 'response_option_id', targetKey: 'id' })

Response.belongsTo(Account, { foreignKey: 'account_id', targetKey: 'id' })
Account.hasMany(Response, { foreignKey: 'account_id', targetKey: 'id' })

module.exports = {
  Account,
  Profile,
  Question,
  ProfileQuestion,
  Response,
  ResponseOption,
  sequelize
}