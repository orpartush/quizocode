import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaWindowClose } from 'react-icons/fa';
import Swal from 'sweetalert2';

function Navbar() {
    const { loggedInUser, logout } = useContext(UserContext);
    const [isBurgerClicked, setisBurgerClicked] = useState(false);
    const history = useHistory();

    const onLogout = async () => {
        setisBurgerClicked(false);
        await logout();
        history.push('/');
        Swal.fire('Logged out successfully.', '', 'success');
    };

    const onMenuClick = () => {
        setisBurgerClicked(!isBurgerClicked);
    };

    const linksToDisplay = loggedInUser ? (
        <>
            <Link
                className="user-profile"
                to={'/profile/' + loggedInUser._id}
                onClick={() => setisBurgerClicked(false)}
                title="Profile"
            >
                <span>
                    <img src={loggedInUser.imgUrl} alt="User" />
                </span>
            </Link>
            <Link className="logout" onClick={onLogout} to={'/'}>
                <span>Logout</span>
            </Link>
        </>
    ) : (
        <>
            <Link to={'/login'} onClick={() => setisBurgerClicked(false)}>
                <span>Login</span>
            </Link>
            <Link to={'/register'} onClick={() => setisBurgerClicked(false)}>
                <span>Register</span>
            </Link>
        </>
    );

    return (
        <nav className="navbar">
            <div className="wrapper container flex space-between align-center">
                <Link className="logo" to="/">
                    Quizocode
                </Link>
                <section className={(isBurgerClicked ? 'menu-open ' : '') + 'nav-links flex align-center justify-end'}>
                    {isBurgerClicked && (
                        <span className="close-icon-container flex justify-end">
                            <span className="close-icon" onClick={() => setisBurgerClicked(false)}>
                                <FaWindowClose />
                            </span>
                        </span>
                    )}
                    <Link to="/" onClick={() => setisBurgerClicked(false)}>
                        <span>Home</span>
                    </Link>
                    <Link to="/ranking" onClick={() => setisBurgerClicked(false)}>
                        <span>Ranking</span>
                    </Link>
                    {linksToDisplay}
                </section>
                {!isBurgerClicked && <HiMenuAlt3 className="burger-icon" onClick={e => onMenuClick(e)} />}
            </div>
            {isBurgerClicked && <span className="screen" onClick={() => setisBurgerClicked(false)}></span>}
        </nav>
    );
}

export default Navbar;
