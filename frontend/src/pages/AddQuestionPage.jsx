import React, { useEffect, useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { QuizContext } from '../store/contexts/QuizContext';
import { UserContext } from '../store/contexts/UserContext';

import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

function AddQuestionPage() {
    const { loggedInUser, updateUser } = useContext(UserContext);
    const { loadQuizzes, quizzes, addQuestion } = useContext(QuizContext);
    const { register, handleSubmit } = useForm();
    const [options, setOptions] = useState('loading');

    const history = useHistory();

    useEffect(() => {
        const getQuizzes = async () => await loadQuizzes();
        getQuizzes();
    }, [loadQuizzes]);

    useEffect(() => {
        const getOptions = () => {
            let currOptions = quizzes.map(quiz => {
                return {
                    id: quiz._id,
                    category: quiz.category,
                };
            });
            setOptions(currOptions);
        };
        getOptions();
    }, [quizzes]);

    const getQuestionToStore = questionData => {
        let answerOptions = [];
        for (let key in questionData) {
            if (key.indexOf('ans-') !== -1) answerOptions.push(questionData[key]);
        }

        const { category, code, correctAns, question } = questionData;
        const authorID = loggedInUser._id;
        return {
            id: uuidv4(),
            category,
            question,
            code,
            correctAns,
            authorID,
            ansOptions: answerOptions,
            date: Date.now(),
            likes: 0,
        };
    };

    const onSubmit = async questionData => {
        let questionToStore = getQuestionToStore(questionData);
        await addQuestion(questionToStore);
        let updatedUser = {
            ...loggedInUser,
            uploadedQuestions: [...loggedInUser.uploadedQuestions, questionToStore.id],
        };
        await updateUser(updatedUser);
        history.push('/');
        Swal.fire('Thanks!', 'Question accepted!', 'success');
    };

    return (
        <div className="add-question-page container">
            <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                <h1>Publish Question</h1>
                <section className="categories flex flex-column">
                    <span>Category: </span>
                    <select name="category" ref={register} required>
                        <option disabled>Choose category</option>
                        {options !== 'loading' ? (
                            options.map(option => <option key={option.id}>{option.category}</option>)
                        ) : (
                            <option disabled>Loading...</option>
                        )}
                    </select>
                </section>
                <section className="question flex flex-column">
                    <span>Question: </span>
                    <textarea
                        cols="60"
                        rows="5"
                        placeholder="The question goes here..."
                        name="question"
                        ref={register}
                        required
                    ></textarea>
                </section>
                <section className="snippet flex flex-column">
                    <span>Code snippet: </span>
                    <textarea
                        cols="60"
                        rows="5"
                        placeholder="code ? addCode() : skip() //optional"
                        name="code"
                        ref={register}
                    ></textarea>
                </section>
                <section className="answers flex flex-column">
                    <span>Answers: </span>
                    <div className="flex flex-column">
                        <textarea cols="60" rows="1" name="ans-1" placeholder="Answer 1" ref={register} required></textarea>
                        <textarea cols="60" rows="1" name="ans-2" placeholder="Answer 2" ref={register} required></textarea>
                        <textarea cols="60" rows="1" name="ans-3" placeholder="Answer 3" ref={register} required></textarea>
                        <textarea cols="60" rows="1" name="ans-4" placeholder="Answer 4" ref={register} required></textarea>
                    </div>
                </section>
                <section className="correct-ans">
                    <span>Correct answer: </span>
                    <select name="correctAns" ref={register} required>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </section>
                <section className="btns-container flex justify-end">
                    <button className="publish-btn">Publish</button>
                    <Link className="cancel-btn" to="/">
                        Cancel
                    </Link>
                </section>
            </form>
        </div>
    );
}

export default AddQuestionPage;
