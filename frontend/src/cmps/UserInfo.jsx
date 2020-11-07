import React, { useState, useEffect, useContext } from 'react';
import { QuizContext } from '../store/contexts/QuizContext';
import CodeSnippet from './CodeSnippet';

function UserInfo({ currUser, isOverview, isUploads }) {
    const { loadQuestionById } = useContext(QuizContext);
    const [infoToDisplay, setInfo] = useState('Loading...');
    const [userUploads, setUserUploads] = useState([]);

    const overview = (
        <article className="overview">
            <div className="wrapper flex">
                <section className="techs-container grow-1">
                    <p className="title">Skills:</p>
                    <div className="user-tech flex wrap">
                        {currUser.techs ? currUser.techs.map((tech, idx) => <p key={idx}>{tech}</p>) : <p>Loading...</p>}
                        {currUser.techs && currUser.techs.length === 0 && <p>No skills yet.'</p>}
                    </div>
                </section>
                <section className="summery-container grow-1">
                    <p className="title">About:</p>
                    <p className="summery">{currUser.summery || 'No info yet.'}</p>
                </section>
            </div>
            <section className="knowledge">
                <p className="title">Badges:</p>
                <section className="completed-quiz-container flex align-center justify-center">
                    {currUser.knowledge ? (
                        currUser.knowledge.map((quiz, idx) => (
                            <section className="completed-quiz flex flex-column align-center" key={idx}>
                                <img src={quiz.badge} alt="Badge" />
                                <span>{quiz.category}</span>
                            </section>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                    {currUser.knowledge && currUser.knowledge.length === 0 && <p>No badges yet.</p>}
                </section>
            </section>
        </article>
    );

    useEffect(() => {
        setInfo(overview);
    }, [currUser]);

    useEffect(() => {
        const uploads = (
            <article className="uploads">
                <p className="title">
                    {userUploads.length} Questions by {currUser.name}:
                </p>
                <section className="questions-container">
                    {userUploads.length > 0 &&
                        userUploads.map((questionData, idx) => {
                            return (
                                <section className="question-container" key={idx}>
                                    <section className="question flex align-center space-between">
                                        <span>{questionData.question}</span>
                                    </section>
                                    {questionData.code && (
                                        <section className="question-code">
                                            <CodeSnippet code={questionData.code} />
                                        </section>
                                    )}
                                </section>
                            );
                        })}
                </section>
            </article>
        );

        setInfo(uploads);
    }, [userUploads]);

    useEffect(() => {
        const setClickedInfo = async () => {
            if (isOverview) setInfo(overview);
            if (isUploads) {
                const uploadsData = await Promise.all(
                    currUser.uploadedQuestions.map(async questionId => {
                        let uploadedQuestion = await loadQuestionById(questionId);
                        return uploadedQuestion;
                    })
                );
                setUserUploads(uploadsData);
            }
            return;
        };
        setClickedInfo();
    }, [isOverview, isUploads]);

    return <div className="user-info">{infoToDisplay}</div>;
}

export default UserInfo;
