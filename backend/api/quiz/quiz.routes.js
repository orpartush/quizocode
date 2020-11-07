const { getQuizzes, getQuiz, getQuestion, deleteQuiz, updateQuiz, createQuiz } = require('./quiz.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const express = require('express');
const router = express.Router();

router.get('/', getQuizzes);
router.get('/category/:category', getQuiz);
router.post('/', requireAuth, createQuiz);
router.put('/question', requireAuth, updateQuiz);
router.get('/question/:id', getQuestion);
router.delete('/:id', requireAuth, deleteQuiz);

module.exports = router;
