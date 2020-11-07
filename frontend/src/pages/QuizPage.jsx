import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { StorageService } from '../services/StorageService';
import { QuizContext } from '../store/contexts/QuizContext';
import Quiz from '../cmps/Quiz';
import LiveChat from '../cmps/LiveChat';
import QuizConclusion from '../cmps/QuizConclusion';
import { Line } from 'rc-progress';

function QuizPage() {
    const { loadQuiz, currQuiz } = useContext(QuizContext);
    const [questions, setQuestions] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [likes, setLikes] = useState(0);
    const [progress, setProgress] = useState(0);

    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        const getQuiz = async () => {
            const quizCategory = params.category;
            const loadedQuiz = await loadQuiz(quizCategory);
            if (loadedQuiz === null) history.push('/err-page');
        };

        getQuiz();
    }, []);

    useEffect(() => {
        if (currQuiz) {
            setQuestions(currQuiz.questions);
            let answers = currQuiz.questions.map(question => question.correctAns);
            setCorrectAnswers(answers);
        }
    }, [currQuiz]);

    const updateProgress = questionIdx => {
        let questsAnswered = questionIdx + 1;
        let currProgress = Math.floor((questsAnswered / questions.length) * 100);
        setProgress(currProgress);
    };

    const onQuizEnd = userLikes => {
        setLikes(userLikes);
        const category = currQuiz.category.toLowerCase();
        StorageService.store(category + 'CurrQuestionIdx', 0);
        setIsFinished(true);
    };

    return (
        <div className="quiz-page container">
            {currQuiz ? (
                <>
                    <header>
                        <h1>{currQuiz.category}</h1>
                        <section className="progress-container flex align-center">
                            <Line
                                className="progress-bar"
                                percent={progress}
                                strokeWidth="2"
                                strokeColor="#fd6585"
                                trailWidth="1"
                            />
                            <p className="progress-str">{progress}%</p>
                        </section>
                    </header>
                    <main>
                        {isFinished ? (
                            <QuizConclusion quiz={currQuiz} answers={correctAnswers} likes={likes} />
                        ) : (
                            <>
                                <Quiz
                                    questions={questions}
                                    category={currQuiz.category}
                                    onProgress={updateProgress}
                                    onFinish={onQuizEnd}
                                />
                                <LiveChat category={currQuiz.category} />
                            </>
                        )}
                    </main>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default QuizPage;
