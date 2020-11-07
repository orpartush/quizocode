export const QuizReducer = (state, action) => {
    switch (action.type) {
        case 'SET_QUIZZES':
            return {
                ...state,
                quizzes: action.quizzes,
            };
        case 'SET_QUIZ':
            return {
                ...state,
                currQuiz: action.quiz,
            };
        default:
            return state;
    }
};
