import HttpService from './HttpService.js';

export const UserService = {
    query,
    signup,
    login,
    logout,
    getUser,
    updateUser,
};

async function query() {
    const users = await HttpService.get('user/');
    return users;
}

async function signup(userCred) {
    const newUser = await HttpService.post('auth/signup', userCred);
    if (newUser) return _setUserSession(newUser);
    else return null;
}

async function login(userCred) {
    const user = await HttpService.post('auth/login', userCred);
    return _setUserSession(user);
}

async function logout() {
    await HttpService.post('auth/logout');
    sessionStorage.clear();
}

async function getUser(id) {
    const user = await HttpService.get(`user/${id}`);
    return user;
}

async function updateUser(user) {
    let updatedUser = await HttpService.put(`user/${user._id}`, user);
    _setUserSession(updatedUser);
    return updatedUser;
}

function _setUserSession(user) {
    if (!user) return;
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
}
