import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';
import { QuizContext } from '../store/contexts/QuizContext';

export default function HomePage() {
    const { loggedInUser } = useContext(UserContext);
    const { loadQuizzes, quizzes } = useContext(QuizContext);

    useEffect(() => {
        const getQuizzes = async () => {
            window.scrollTo(0, 0);
            await loadQuizzes();
            renderQuizzes();
        };
        getQuizzes();
    }, []);

    const renderQuizzes = () => {
        return quizzes.map(({ category, imgUrl, questions }) => {
            const linkTo = loggedInUser ? `quiz/${category}` : '/login';
            return (
                <Link to={linkTo} className="flex" key={category}>
                    <img className="self-center" src={imgUrl} alt={category} />
                    <div className="details-container flex flex-column justify-end">
                        <span className="quiz-name">{category}</span>
                        <small className="questions-num">{questions.length} questions</small>
                    </div>
                </Link>
            );
        });
    };

    return (
        <div className="home-page flex flex-column align-center">
            <div className="hero-wrapper">
                <header className="hero flex flex-column align-center justify-center container">
                    <p className="title">QUIZOCODE</p>
                    <p className="sub-title">Explore quizzes. Improve your skills. Get badges.</p>
                </header>
            </div>
            <main className="flex flex-column align-center container">
                <div className="categories-container flex flex-column justify-center">
                    <p className="featured">Featured:</p>
                    <section className="categories flex wrap space-evenly">{quizzes && renderQuizzes()}</section>
                </div>
                <section className="about flex flex-column" id="about">
                    <p className="title self-center">About</p>
                    <p>
                        Quizocode is a quizzes system for developers. <br /> We are here to use the power of the developers
                        community to sharpen your skills, to prepare you to job interviews and to get cool badges just for fun!
                    </p>
                </section>
                <section className="instructions flex flex-column">
                    <p className="title self-center">How it works?</p>
                    <p className="info">
                        <span className="line flex align-center">
                            <span>For every correct answer, you earn 25 points.</span>
                        </span>
                        <span className="line flex align-center">
                            <span>By completing a quiz without any mistakes, you earn a badge.</span>
                        </span>
                        <span className="line flex align-center">
                            <span>
                                Check out our <Link to="/ranking">Ranking</Link> page to see if you are one of our greatest
                                members!
                            </span>
                        </span>
                    </p>
                </section>
            </main>
            <section className="add-questions flex flex-column align-center">
                <p className="add-intro">
                    Do you want to leave your mark in Quizocode's community?
                    <br />
                    You can do so by adding your own questions to Quizocode's quizzes!
                </p>
                <Link to={loggedInUser ? '/add-question' : '/login'} className="add-btn">
                    Add Question
                </Link>
            </section>
        </div>
    );
}
