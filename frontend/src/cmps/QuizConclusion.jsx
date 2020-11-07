import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';
import { StorageService } from '../services/StorageService';
import CodeSnippet from './CodeSnippet';
import UserInfoPreview from './UserInfoPreview';
import trophyIcon from '../assets/img/trophy.svg';
import Swal from 'sweetalert2';

function QuizConclusion({ quiz, answers }) {
    const { loggedInUser, updateUser } = useContext(UserContext);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState('');
    const [reward, setReward] = useState('');
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [isUserUpdated, setIsUserUpdated] = useState(false);

    useEffect(() => {
        const intUserAnswers = StorageService.load(`${quiz.category.toLowerCase()}Answers`);
        const strUserAnswers = intUserAnswers.map(ans => (ans + 1).toString());
        setUserAnswers(strUserAnswers);
    }, [quiz.category]);

    useEffect(() => {
        if (userAnswers.length === 0) return;
        const calculateScore = () => {
            const diff = [];
            userAnswers.forEach((ans, idx) => {
                if (answers[idx] !== ans) diff.push(quiz.questions[idx]);
            });
            if (diff.length === 0) {
                Swal.fire('Great Job!', 'Perfect quiz!', 'success');
            }
            setWrongAnswers(diff);
            setScore(`${answers.length - diff.length}/${answers.length}`);
            if (diff.length === 0) setReward(answers.length * 25);
            else setReward((answers.length - diff.length) * 25);
        };
        calculateScore();
    }, [userAnswers, answers, quiz.questions]);

    useEffect(() => {
        const cleanStorage = () => {
            StorageService.remove(`${quiz.category.toLowerCase()}Answers`);
        };
        cleanStorage();
    }, [wrongAnswers, quiz.category]);

    useEffect(() => {
        if (reward === '') return;
        const updateUserData = async () => {
            let updatedUser = {
                ...loggedInUser,
                points: loggedInUser.points + reward,
            };
            if (
                wrongAnswers.length === 0 &&
                !updatedUser.knowledge.some(completedQuiz => completedQuiz.category === quiz.category)
            ) {
                updatedUser.knowledge.push({ category: quiz.category, badge: quiz.imgUrl });
            }
            await updateUser(updatedUser);
            setIsUserUpdated(true);
        };
        updateUserData();
    }, [reward, quiz.category, wrongAnswers.length]);

    return (
        <div className="quiz-conclusion flex flex-column">
            <p className="title">Quiz Conclusion</p>
            <section className="flex flex-column space-between">
                <div className="stats-wrapper flex space-evenly align-center">
                    <section className="user-preview">
                        {isUserUpdated && <UserInfoPreview userID={loggedInUser._id} title="Your profile" />}
                    </section>
                    <section className="score-container flex flex-column align-center">
                        <span>Your score </span>
                        <span className="score">{score}</span>
                    </section>
                    <section className="user-reward flex flex-column align-center">
                        <span>Your reward </span>
                        <div className="points">
                            <img src={trophyIcon} alt="Points" />
                            <span className="reward">{reward}</span>
                        </div>
                    </section>
                </div>
                <section className="wrong-questions">
                    <p className="wrong-quest-header">Wrong Questions:</p>
                    {wrongAnswers.length > 0 ? (
                        wrongAnswers.map(({ question, id, code, authorID }) => {
                            return (
                                <section className="question-container flex flex-column" key={id}>
                                    <section className="question">{question}</section>
                                    {code && (
                                        <section className="question-code">
                                            <CodeSnippet code={code} />
                                        </section>
                                    )}
                                    {isUserUpdated && (
                                        <div className="user-preview-wrapper" title="Author">
                                            <UserInfoPreview userID={authorID} />
                                        </div>
                                    )}
                                </section>
                            );
                        })
                    ) : (
                        <>
                            <p>
                                None, GOOD JOB!
                                <span role="img" aria-label="Celebrate">
                                    🥳
                                </span>
                            </p>
                            <section className="badge-container flex align-center justify-center">
                                <span>New badge: </span>
                                <img src={quiz.imgUrl} alt="Badge" />
                            </section>
                        </>
                    )}
                </section>
            </section>
            <Link to="/" className="homepage-btn self-center">
                Back to homepage
            </Link>
        </div>
    );
}

export default QuizConclusion;
