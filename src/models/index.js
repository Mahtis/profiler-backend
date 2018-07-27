const Sequelize = require('sequelize')
const conf = require('../conf')

console.log(conf.DB_URL)
const sequelize = new Sequelize(conf.DB_URL, {
  dialect: 'postgres',
  logging: false
})

const Account = sequelize.define('account', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  username: { type: Sequelize.STRING, unique: true, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  firstname: { type: Sequelize.STRING },
  lastname: { type: Sequelize.STRING },
  birthdate: { type: Sequelize.DATEONLY },
  email: { type: Sequelize.STRING, allowNull: false },
  role: { type: Sequelize.STRING }
},
{
  tableName: 'account',
  underscored: true,
  timestamps: true
})

const Profile = sequelize.define('profile', {
  id: {
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  account_id: { type: Sequelize.UUID, allowNull: false },
  active: { type: Sequelize.BOOLEAN },
  picture: { type: Sequelize.STRING, unique: true },
  thumbnail: { type: Sequelize.STRING }
},
{
  tableName: 'profile',
  underscored: true,
  timestamps: true
})

const Question = sequelize.define('question', {
  id: {
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  text: { type: Sequelize.STRING, allowNull: false }
},
{
  tableName: 'question',
  underscored: true,
  timestamps: false
})

const ResponseOption = sequelize.define('response_option', {
  id: {
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  question_id: { type: Sequelize.BIGINT, allowNull: false },
  option_value: { type: Sequelize.STRING, allowNull: false }
},
{
  tableName: 'response_option',
  underscored: true,
  timestamps: false
})

const ProfileQuestion = sequelize.define('profile_question', {
  id: {
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  profile_id: { type: Sequelize.BIGINT, allowNull: false },
  question_id: { type: Sequelize.BIGINT, allowNull: false },
  correct_response: { type: Sequelize.BIGINT, allowNull: false }
},
{
  tableName: 'profile_question',
  underscored: true,
  timestamps: false
})

const Response = sequelize.define('response', {
  id: {
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  response_option_id: { type: Sequelize.BIGINT, allowNull: false },
  account_id: { type: Sequelize.UUID, allowNull: false },
  profile_id: { type: Sequelize.BIGINT, allowNull: false },
  correct: { type: Sequelize.BOOLEAN }
},
{
  tableName: 'response',
  underscored: true,
  timestamps: true
})

Profile.belongsTo(Account, { foreignKey: 'account_id', targetKey: 'id' })
Account.hasMany(Profile, { foreignKey: 'account_id', targetKey: 'id' })

Profile.hasMany(Response, { foreignKey: 'profile_id', targetKey: 'id' })
Response.belongsTo(Profile, { foreignKey: 'profile_id', targetKey: 'id' })

//Question.hasMany(ProfileQuestion, { foreignKey: 'question_id', targetKey: 'id' })
//ProfileQuestion.belongsTo(Question, { foreignKey: 'question_id', targetKey: 'id' })

Profile.belongsToMany(Question, { through: ProfileQuestion })
Question.belongsToMany(Profile, { through: ProfileQuestion })

ResponseOption.belongsTo(Question, { foreignKey: 'question_id', targetKey: 'id' })
Question.hasMany(ResponseOption, { foreignKey: 'question_id', targetKey: 'id' })

ProfileQuestion.belongsTo(ResponseOption, { foreignKey: 'correct_response', sourceKey: 'id' })

ProfileQuestion.hasMany(Response, { foreignKey: 'profile_question_id', targetKey: 'id' })
Response.belongsTo(ProfileQuestion, { foreignKey: 'profile_question_id', targetKey: 'id' })

Response.belongsTo(ResponseOption, { foreignKey: 'response_option_id', targetKey: 'id' })

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