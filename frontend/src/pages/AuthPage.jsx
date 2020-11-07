import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoginForm from '../cmps/LoginForm';
import RegisterForm from '../cmps/RegisterForm';

function AuthPage() {
    const [formToDisplay, setForm] = useState(window.location.pathname);
    const { location } = useHistory();

    useEffect(() => {
        location.pathname === '/login' ? setForm('login') : setForm('register');
    }, [location.pathname]);

    return (
        <div className="auth-page flex flex-column align-center justify-center">
            <h1 className="title align-center">Quizocode</h1>
            {formToDisplay === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
    );
}

export default AuthPage;
