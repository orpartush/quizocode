import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';
import CodeSnippet from './CodeSnippet';
import UserInfoPreview from './UserInfoPreview';
import { StorageService } from '../services/StorageService.js';
import { AiOutlineLike, AiTwotoneLike } from 'react-icons/ai';

function Quiz({ questions, category, onProgress, onFinish }) {
    const { getUserByID, updateUser } = useContext(UserContext);
    const [questionIdx, setQuestionIdx] = useState(0);
    const [questionStr, setQuestionStr] = useState('Loading your next question...');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedAnsIdx, setSelectedAnsIdx] = useState('');
    const [userAnswers, setUserAnswers] = useState([]);
    const [authorID, setAuthorID] = useState('');
    const [isLike, setIsLike] = useState(false);

    useEffect(() => {
        const loadUserProgress = () => {
            if (!category) return;
            let fixedCategory = category.toLowerCase();
            setQuestionIdx(StorageService.load(`${fixedCategory}CurrQuestionIdx`) ?? questionIdx);
            setUserAnswers(StorageService.load(`${fixedCategory}Answers`) ?? userAnswers);
        };
        loadUserProgress();
    }, [category]);

    const onOptionClick = clickedOption => {
        setSelectedAnsIdx(clickedOption);
    };

    const onNextQuestionClick = async () => {
        if (selectedAnsIdx === '') return;
        if (isLike) {
            await updateAuthorData();
            setIsLike(false);
        }
        onProgress(questionIdx);
        setUserAnswers([...userAnswers, selectedAnsIdx]);
        setQuestionIdx(questionIdx + 1);
        setSelectedAnsIdx('');
    };

    const updateAuthorData = async () => {
        const author = await getUserByID(authorID);
        let updatedAuthor = {
            ...author,
            likes: author.likes + 1,
        };
        await updateUser(updatedAuthor);
    };

    useEffect(() => {
        if (questionIdx === questions.length && questionIdx !== 0) {
            let quizCategory = category.toLowerCase();
            StorageService.store(quizCategory + 'Answers', userAnswers);
            onFinish();
            return;
        }

        if (questions.length > 0) {
            let currQuestion = questions[questionIdx];
            setQuestionStr(currQuestion.question);
            setCodeSnippet(currQuestion.code);
            setOptions(currQuestion.ansOptions);
            setAuthorID(currQuestion.authorID);
        }

        const storeUserProgress = () => {
            let quizCategory = category.toLowerCase();
            StorageService.store(quizCategory + 'Answers', userAnswers);
            if (questionIdx === questions.length && questionIdx !== 0) return;
            StorageService.store(quizCategory + 'CurrQuestionIdx', questionIdx);
        };

        storeUserProgress();
    }, [userAnswers, questions, questionIdx, onFinish, category]);

    return (
        <div className="quiz">
            <form className="flex flex-column justify-center" onSubmit={e => e.preventDefault()}>
                <section className="question-container">
                    <section className="question flex align-center space-between">
                        <span>
                            Q#{questionIdx + 1}: {questionStr}
                        </span>
                        <button className="like-btn" title="Like" onClick={() => setIsLike(!isLike)}>
                            {!isLike ? <AiOutlineLike /> : <AiTwotoneLike />}
                        </button>
                    </section>
                    {codeSnippet && (
                        <section className="question-code">
                            <CodeSnippet code={codeSnippet} />
                        </section>
                    )}
                </section>
                <section className="options flex flex-column">
                    {options.map((option, idx) => (
                        <label className="flex align-center" key={idx} onClick={() => onOptionClick(idx)}>
                            <input
                                type="checkbox"
                                name={`option${idx + 1}`}
                                checked={selectedAnsIdx === idx}
                                value={option}
                                readOnly={true}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </section>
                <div className="btns-author-container flex space-between align-center">
                    <section className="btns grow-3 flex align-center">
                        <button className="next-btn" onClick={onNextQuestionClick}>
                            Next Question
                        </button>
                        <Link className="quit-btn" to="/">
                            Quit
                        </Link>
                    </section>
                    <section className="author flex grow-1 justify-end" title="Question Author">
                        <UserInfoPreview userID={authorID} />
                    </section>
                </div>
            </form>
        </div>
    );
}

export default Quiz;
