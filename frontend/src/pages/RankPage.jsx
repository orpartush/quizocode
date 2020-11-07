import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../store/contexts/UserContext';
import SearchPanel from '../cmps/SearchPanel';
import trophyIcon from '../assets/img/trophy.svg';
import likeIcon from '../assets/img/like.svg';

function RankPage() {
    const { loadUsers, users } = useContext(UserContext);
    const [usersToDisplay, setUsersToDisplay] = useState([]);
    const [sortedUsers, setSortedUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            await loadUsers();
        };

        getUsers();
    }, []);

    useEffect(() => {
        setUsersToDisplay(users);
    }, [users]);

    const onSearchChange = value => {
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(value));
        setUsersToDisplay(filteredUsers);
    };

    useEffect(() => {
        setUsersToDisplay(sortedUsers);
    }, [sortedUsers]);

    const onSortChange = value => {
        const usersCopy = [...usersToDisplay];
        if (value === 'name') {
            const sortedByName = usersCopy.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
            setSortedUsers(sortedByName);
        } else if (value === 'points') {
            const sortedByPoints = usersCopy.sort((a, b) => b.points - a.points);
            setSortedUsers(sortedByPoints);
        } else {
            const sortedByLikes = usersCopy.sort((a, b) => b.likes - a.likes);
            setSortedUsers(sortedByLikes);
        }
    };

    const renderUsersList = () => {
        return usersToDisplay.map(user => {
            const { _id, imgUrl, name, role, points, likes } = user;
            return (
                <section className="user flex align-center space-between" key={_id}>
                    <section className="main-info flex align-center">
                        <img src={imgUrl} alt="User" />
                        <section className="user-details flex flex-column">
                            <span className="name">{name}</span>
                            <span className="role">{role}</span>
                            <section className="badges flex align-center">
                                {user.knowledge.map(({ badge, category }, idx) => (
                                    <img src={badge} title={`Completed ${category} quiz`} key={idx} />
                                ))}
                            </section>
                        </section>
                    </section>
                    <section className="user-states flex">
                        <div className="points flex flex-column self-center" title="Points">
                            <img src={trophyIcon} alt="Points" />
                            <span>{points}</span>
                        </div>
                        <div className="likes flex flex-column" title="Likes">
                            <img src={likeIcon} alt="Likes" />
                            <span>{likes}</span>
                        </div>
                    </section>
                    <section className="check flex">
                        <Link to={`/profile/${_id}`} title="User Profile">
                            Profile
                        </Link>
                    </section>
                </section>
            );
        });
    };

    return (
        <div className="rank-page container">
            <header>Ranking</header>
            <section className="search-container flex align-center space-between">
                <SearchPanel onSearch={onSearchChange} onSort={onSortChange} />
            </section>
            <section className="users-list">{users.length > 0 && renderUsersList()}</section>
        </div>
    );
}

export default RankPage;
