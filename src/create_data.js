const fs = require('fs')
const axios = require('axios')
const faker = require('faker')
const sharp = require('sharp')
const {
  sequelize,
  Account,
  Profile,
  Question,
  ResponseOption,
  Response,
  ProfileQuestion } = require('./models/index')

const randBetween = (start, end) => {
  return Math.floor(Math.random() * (end-start) + start)
}

const createProfilePicture = async (profileId) => {
  const imgName = `public/img/profiles/profile${profileId}.jpg`
  const img = fs.readFileSync(`public/img/${profileId}.jpg`)
  await sharp(img)
    .resize(500, 600)
    .crop()
    .toFile(imgName)
  /*
  const img = await axios.get('http://lorempixel.com/500/600/people/', {
    responseType: 'arraybuffer'
  })
    .then(response => new Buffer(response.data, 'binary').toString('base64'))
  fs.writeFileSync(imgName, img, 'base64', (err) => {
    if (err) throw err
  })
  */
  return `img/profiles/profile${profileId}.jpg`
}

const createThumbnail = async imgName => {
  const img = fs.readFileSync(`public/img/profiles/profile${imgName}.jpg`)
  const thumbName = `public/img/thumbnails/thumb_${imgName}.jpg`
  await sharp(img)
    .resize(200, 200)
    .crop()
    .toFile(thumbName)
  return `img/thumbnails/thumb_${imgName}.jpg`
}

const createAccounts = async (n = 1) => {
  const users = []
  for (let i=0; i<n; i++) {
    const u = await Account.create({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthdate: faker.date.between('1950-01-01', '2000-01-01').toISOString().slice(0, 10),
      email: faker.internet.email(),
      role: 'USER'
    })
    users.push(u)
  }
  return users
}

const createProfile = async (account) => {
  const profile = await Profile.create({
    active: true,
    account_id: account.id
    // picture: 'img/prof1',
    // thumbnail: 'img/thumbnails/prof1'
  })
  return profile
}

const createQuestions = async (questions) => {
  const qs = []
  for(let i=0; i<questions.length; i++) {
    const question = await Question.create({
      text: questions[i]
    })
    qs.push(question)
  }
  return qs
}

const creteResponseOptions = async (question, values) => {
  const options = []
  values.forEach(value => {
    ResponseOption.create({
      option_value: value,
      question_id: question.id
    })
      //.then(option => option.setQuestion(question))
      .then(option => options.push(option)
    )
  })
  return await options
}

const createProfileQuestions = async (profile, questions, allOptions) => {
  const pquestions = []
  for (let i=0; i<questions.length; i++) {
    const question = questions[i]
    const questionOptions = allOptions[i]
    const corr = questionOptions[randBetween(0, questionOptions.length)]
    const pq = await ProfileQuestion.create({
      profile_id: profile.id,
      question_id: question.id,
      correct_response: corr.id
    })
    pquestions.push(pq)
  }
  return pquestions
}

const getProfileQuestions = async profile => {
  return await ProfileQuestion.findAll({where: {profile_id: profile.id}})
}

const createResponse = async (account, option, profileQuestion) => {
  const response = await Response.create({
    correct: (profileQuestion.correct_response === option.id),
    account_id: account.id,
    response_option_id: option.id,
    profile_question_id: profileQuestion.id
  })
  return response
}

const run = async n => {
  await sequelize.sync({ force: true })
  console.log('forced')

  const questions = await createQuestions([
    'How old is this person?', 
    'How tall is this person?',
    'How much does this person weigh?',
    'What type of music does this person like?',
    'What type of food does this person like?',
    'Is this a cat or dog person?'
  ])
  console.log('questions created')

  const options = [
    await creteResponseOptions(questions[0], ['18-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '65-']),
    await creteResponseOptions(questions[1], ['-145', '146-155', '156-165', '166-175', '176-185', '186-195', '196-']),
    await creteResponseOptions(questions[2], ['-50', '51-60', '61-70', '71-80', '81-90', '91-100', '101-110', '111-120', '121-']),
    await creteResponseOptions(questions[3], ['pop', 'rock', 'heavy', 'punk', 'electronic', 'reggae', 'jazz', 'classical', 'other']),
    await creteResponseOptions(questions[4], ['Asian', 'Italian', 'Latin', 'French', 'Russian', 'African']),
    await creteResponseOptions(questions[5], ['Dog', 'Cat', 'Both', 'Neither'])
  ]
  console.log('options created')

  const accounts = await createAccounts(n)
  console.log('accounts created')

  const profiles = []
  for (let i=0; i<accounts.length; i++) {
    const account = accounts[i]
    const profile = await createProfile(account)
    console.log(`profile ${i} created`)
    await createProfileQuestions(profile, questions, options)
    const picture = await createProfilePicture(profile.id)
    console.log('image created')
    const thumbnail = await createThumbnail(profile.id)
    console.log('thumbnail created')
    await profile.set('picture', picture)
    await profile.set('thumbnail', thumbnail)
    await profile.save()
    profiles.push(profile)
  }
  for (let i=0; i<profiles.length; i++) {
    const profile = profiles[i]
    const accountsStart = randBetween(0, accounts.length - 2)
    const accountsEnd = randBetween(accountsStart + 1, accounts.length - 1)
    console.log(`accounts ${accountsStart}-${accountsEnd} selected for responders `)
    const profQuestions = await getProfileQuestions(profile)
    for (let  j=accountsStart; j<=accountsEnd; j++) {
      const responder = accounts[j]
      for (let k=0; k<profQuestions.length; k++) {
        const questionOptions = options[k] 
        const option = questionOptions[randBetween(0, questionOptions.length)]
        await createResponse(responder, option, profQuestions[k])
      }
      console.log(`responses for ${j} created`)
    }
    console.log(`profile ${i} responses created`)
  }
  
  //console.log('Profile: ', profile)
  //const pq = await createProfileQuestion(profile, questions[0])
  //console.log('ProfileQuestion: ', pq)
  //const response = await createResponse(account, options[0], pq)
  //console.log('Response: ', response)
  
  console.log('done creating ', n)
}

//createThumbnail('img/pic1.jpeg')
run(100).then(console.log('ran it'))
