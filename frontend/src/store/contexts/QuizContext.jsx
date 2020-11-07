import React, { createContext, useReducer } from 'react';
import { QuizReducer } from '../reducers/QuizReducer';
import { QuizService } from '../../services/QuizService';

const initialState = {
    quizzes: [],
    currQuiz: null,
};

//Actions
const SET_QUIZZES = 'SET_QUIZZES';
const SET_QUIZ = 'SET_QUIZ';

export const QuizContext = createContext(initialState);

export const QuizContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(QuizReducer, initialState);

    async function loadQuizzes() {
        const quizzes = await QuizService.query();
        dispatch({ type: SET_QUIZZES, quizzes });
    }

    async function loadQuiz(category) {
        const quiz = await QuizService.query({ category });
        if (typeof quiz !== 'object') return null;
        dispatch({ type: SET_QUIZ, quiz });
        return quiz;
    }

    async function loadQuestionById(questionId) {
        const question = await QuizService.getQuestionById(questionId);
        return question;
    }

    async function addQuestion(newQuestion) {
        await QuizService.updateQuiz(newQuestion);
    }

    return (
        <QuizContext.Provider
            value={{
                quizzes: state.quizzes,
                currQuiz: state.currQuiz,
                loadQuizzes,
                loadQuiz,
                addQuestion,
                loadQuestionById,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};
