import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { UserContextProvider } from './store/contexts/UserContext';
import { QuizContextProvider } from './store/contexts/QuizContext';

import Navbar from './cmps/Navbar';
import ErrPage from './pages/ErrPage';
import Footer from './cmps/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const RankPage = lazy(() => import('./pages/RankPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const AddQuestionPage = lazy(() => import('./pages/AddQuestionPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));

function App() {
    return (
        <UserContextProvider>
            <QuizContextProvider>
                <main className="app flex flex-column">
                    <Router>
                        <Navbar />
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>
                                <Route exact path="/" component={HomePage} />
                                <Route exact path={['/login', '/register']} component={AuthPage} />
                                <Route exact path="/ranking" component={RankPage} />
                                <Route exact path="/quiz/:category" component={QuizPage} />
                                <Route exact path="/add-question" component={AddQuestionPage} />
                                <Route exact path="/profile/:id" component={UserProfilePage} />
                                <Route exact path="/edit-profile/:id" component={EditProfilePage} />
                                <Route component={ErrPage} />
                            </Switch>
                        </Suspense>
                        <Footer />
                    </Router>
                </main>
            </QuizContextProvider>
        </UserContextProvider>
    );
}

export default App;
