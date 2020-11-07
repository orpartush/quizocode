import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';
import trophyIcon from '../assets/img/trophy.svg';
import likeIcon from '../assets/img/like.svg';

function UserInfoPreview({ userID }) {
    const { getUserByID } = useContext(UserContext);
    const [user, setUser] = useState({});

    useEffect(() => {
        let isMounted = true;
        const loadUserInfo = async () => {
            let user = await getUserByID(userID);
            if (isMounted) setUser(user);
        };
        loadUserInfo();
        return () => (isMounted = false);
    }, [userID, getUserByID]);

    return (
        <Link to={'/profile/' + user._id} className="user-info-preview flex">
            <img src={user.imgUrl} alt="Author" />
            <section className="name-container flex flex-column">
                <div className="name">{user.name}</div>
                <section className="user-states flex">
                    <div className="points">
                        <img src={trophyIcon} alt="Points" />
                        <span>{user.points}</span>
                    </div>
                    <div className="likes">
                        <img src={likeIcon} alt="Likes" />
                        <span>{user.likes}</span>
                    </div>
                </section>
            </section>
        </Link>
    );
}

export default UserInfoPreview;
