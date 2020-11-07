import HttpService from './HttpService.js';

export const QuizService = {
    query,
    getQuizById,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    getQuestionById,
};

function query(filterBy = {}) {
    if (filterBy.category) return HttpService.get(`quiz/category/${filterBy.category}`);
    return HttpService.get('quiz/');
}

function getQuizById(quizId) {
    return HttpService.get(`quiz/${quizId}`);
}

function getQuestionById(questionId) {
    return HttpService.get(`quiz/question/${questionId}`);
}

function addQuiz(quiz) {
    return HttpService.post('quiz', quiz);
}

function updateQuiz(newQuestion) {
    return HttpService.put(`quiz/question`, newQuestion);
}

function deleteQuiz(quizId) {
    return HttpService.delete(`quiz/${quizId}`);
}
