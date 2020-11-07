import React, { createContext, useReducer, useEffect } from 'react';
import { UserReducer } from '../reducers/UserReducer.js';
import { UserService } from '../../services/UserService.js';

const initialState = {
    users: [],
    loggedInUser: null,
};

//Actions
const LOGOUT = 'LOGOUT';
const SET_USER = 'SET_USER';
const SET_USERS = 'SET_USERS';

export const UserContext = createContext(initialState);

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(UserReducer, initialState);

    useEffect(() => {
        const getLoggedInUser = async () => {
            if (sessionStorage.user) {
                const sessionUser = JSON.parse(sessionStorage.user);
                const user = await UserService.getUser(sessionUser._id);
                _setUser(user);
            }
        };
        getLoggedInUser();
    }, []);

    async function onSignup(userCred) {
        const user = await UserService.signup(userCred);
        if (!user) return null;
        _setUser(user);
        return user;
    }

    async function onLogin(userCred) {
        const user = await UserService.login(userCred);
        _setUser(user);
    }

    async function logout() {
        await UserService.logout();
        dispatch({ type: LOGOUT, user: null });
    }

    async function loadUsers(searchValue) {
        const users = await UserService.query(searchValue);
        dispatch({ type: SET_USERS, users });
    }

    async function updateUser(user) {
        let updatedUser = await UserService.updateUser(user);
        _setUser(updatedUser);
    }

    async function getUserByID(userID) {
        const user = await UserService.getUser(userID);
        return user;
    }

    function _setUser(user) {
        dispatch({ type: SET_USER, user });
    }

    return (
        <UserContext.Provider
            value={{
                loggedInUser: state.loggedInUser,
                users: state.users,
                onSignup,
                onLogin,
                logout,
                getUserByID,
                updateUser,
                loadUsers,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
