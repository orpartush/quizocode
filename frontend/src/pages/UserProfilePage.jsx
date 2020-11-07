import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext.jsx';
import { UserService } from '../services/UserService.js';
import UserInfoButton from '../cmps/UserInfoButton.jsx';
import UserInfo from '../cmps/UserInfo.jsx';
import trophyIcon from '../assets/img/trophy.svg';
import likeIcon from '../assets/img/like.svg';

function UserProfilePage() {
    const { loggedInUser } = useContext(UserContext);
    const [user, setUser] = useState({});
    const [overviewBtn, setOverviewBtn] = useState({
        txt: 'Overview',
        isActive: true,
        clr: '#FC335D',
    });
    const [uploadsBtn, setUploadsBtn] = useState({
        txt: 'Uploads',
        isActive: false,
        clr: 'rgb(218, 218, 218)',
    });

    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        const getCurrUser = async userId => {
            let user = await UserService.getUser(userId);
            user.name ? setUser(user) : history.replace('/err-page');
        };
        const displayOverview = () => {
            setOverviewBtn({ ...overviewBtn, isActive: true, clr: '#FC335D' });
            setUploadsBtn({ ...uploadsBtn, isActive: false, clr: 'rgb(218, 218, 218)' });
        };
        getCurrUser(params.id);
        displayOverview();
    }, [params.id, history]);

    const onSectionBtnClick = btnTxt => {
        if (btnTxt === 'Overview') {
            setOverviewBtn({ ...overviewBtn, isActive: true, clr: '#FC335D' });
            setUploadsBtn({ ...uploadsBtn, isActive: false, clr: 'rgb(218, 218, 218)' });
        } else {
            setUploadsBtn({ ...uploadsBtn, isActive: true, clr: '#FC335D' });
            setOverviewBtn({ ...overviewBtn, isActive: false, clr: 'rgb(218, 218, 218)' });
        }
    };

    return (
        <div className="user-profile-page container">
            <header className="flex flex-column justify-center align-center">
                <img className="profile-img" src={user.imgUrl} alt="Profile" />
                <section className="name-container">
                    <span className="name">{user.name}</span>
                    {loggedInUser && user && loggedInUser._id === user._id && (
                        <Link className="edit-btn" to={`/edit-profile/${loggedInUser._id}`} title="Edit Profile">
                            &#x270E;
                        </Link>
                    )}
                </section>
                <span className="role">{user.role}</span>
                <section className="awards flex">
                    <section className="points flex space-evenly" title="Points">
                        <img src={trophyIcon} alt="Points" />
                        <span>{user.points}</span>
                    </section>
                    <section className="likes flex space-evenly" title="Likes">
                        <img src={likeIcon} alt="Likes" />
                        <span>{user.likes}</span>
                    </section>
                </section>
            </header>
            <main>
                <section className="info-btns">
                    <UserInfoButton btnTxt={overviewBtn.txt} clr={overviewBtn.clr} onClick={onSectionBtnClick} />
                    <UserInfoButton btnTxt={uploadsBtn.txt} clr={uploadsBtn.clr} onClick={onSectionBtnClick} />
                </section>
                {user ? (
                    <UserInfo currUser={user} isOverview={overviewBtn.isActive} isUploads={uploadsBtn.isActive} />
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    );
}

export default UserProfilePage;
