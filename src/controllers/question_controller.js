const router = require('express').Router()

const questionService = require('../services/questions')

router.get('/', async (req, res) => {
  // console.log(req)
  const questions = await questionService.getQuestions()
  res.status(200).json(questions)
})

module.exports = router
