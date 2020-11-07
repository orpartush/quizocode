import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';

import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

function RegisterForm() {
    const { onSignup } = useContext(UserContext);
    const [isUserExist, setIsUserExist] = useState(true);
    const history = useHistory();
    const { register, handleSubmit, errors } = useForm({
        mode: 'onBlur',
        validationSchema: Yup.object({
            email: Yup.string().email().required('Email is required'),
            name: Yup.string().min(2, 'Name must have minimum of 2 characters').required(),
            password: Yup.string().min(6, 'Password must have minimum of 6 characters').required(),
        }),
    });

    const onSubmit = async userCred => {
        const user = await onSignup(userCred);
        if (!user) {
            setIsUserExist(false);
            return;
        }
        Swal.fire('Welcome!', 'Start your improvment with our quizzes!', 'success');
        history.push('/');
    };

    return (
        <div className="register-form">
            <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                <input type="email" placeholder="Email" name="email" ref={register} />
                <input type="text" placeholder="Name" name="name" ref={register} />
                <input type="password" placeholder="Password" name="password" ref={register} />
                <section className="errs-container flex flex-column">
                    {errors.email && <small>{errors.email.message}</small>}
                    {errors.name && <small>{errors.name.message}</small>}
                    {errors.password && <small>{errors.password.message}</small>}
                    {!isUserExist && <small>Email already exist</small>}
                </section>
                <button>REGISTER</button>
                <small>
                    Already a member? <Link to="/login">Login</Link>
                </small>
            </form>
        </div>
    );
}

export default RegisterForm;
