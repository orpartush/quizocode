const quizService = require('./quiz.service');

async function getQuizzes(req, res) {
    const quizzes = await quizService.query();
    res.send(quizzes);
}

async function getQuiz(req, res) {
    const quiz = await quizService.getByCategory({ category: req.params.category });
    res.send(quiz);
}

async function deleteQuiz(req, res) {
    await quizService.remove(req.params.id);
    res.end();
}

async function updateQuiz(req, res) {
    const quiz = req.body;
    await quizService.update(quiz);
    res.json(quiz);
}

async function createQuiz(req, res) {
    const quiz = req.body;
    await quizService.add(quiz);
    res.send(quiz);
}

async function getQuestion(req, res) {
    const question = await quizService.getQuestionById(req.params.id);
    res.send(question);
}

module.exports = {
    getQuiz,
    getQuizzes,
    deleteQuiz,
    updateQuiz,
    createQuiz,
    getQuestion,
};
