import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';
import Swal from 'sweetalert2';
import ReactTooltip from 'react-tooltip';
import { AiOutlineInfoCircle } from 'react-icons/ai';

function LoginForm() {
    const { onLogin, loggedInUser } = useContext(UserContext);
    const { register, handleSubmit } = useForm();

    const history = useHistory();
    const superGuest = {
        email: 'test@gmail.com',
        password: '123456',
    };
    const tooltipTxt = `Super-guest allows you to skip the registration process, logs you in with a pre-made account, with full access to Quizocode's features.`;

    useEffect(() => {
        if (loggedInUser) {
            Swal.fire('Welcome back!', 'Logged in successfully', 'success');
            history.push('/');
        }
    }, [loggedInUser, history]);

    const onSubmit = async userCred => {
        await onLogin(userCred);
        if (!loggedInUser) {
            Swal.fire('Login error', 'Bad username or password', 'error');
            return;
        }
    };

    return (
        <div className="login-form">
            <form className="flex flex-column align-center" onSubmit={handleSubmit(onSubmit)}>
                <input type="email" placeholder="Email" name="email" ref={register} />
                <input type="password" placeholder="Password" name="password" ref={register} />
                <button>LOGIN</button>
                <small>
                    Not a member? <Link to="/register">Register</Link>
                </small>
            </form>
            <section className="super-guest flex flex-column align-center">
                <div className="super-guest-desc flex">
                    <span className="tip-icon-wrapper">
                        <AiOutlineInfoCircle data-tip={tooltipTxt} />
                    </span>
                    <ReactTooltip place="top" type="dark" effect="float" multiline={true} className="tooltip" />
                    <span>For your convenience, you can login as super-guest account:</span>
                </div>
                <button className="super-guest-btn" onClick={() => onSubmit(superGuest)}>
                    LOGIN AS SUPER-GUEST
                </button>
            </section>
        </div>
    );
}

export default LoginForm;
