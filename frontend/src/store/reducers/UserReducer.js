export const UserReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                loggedInUser: action.user,
            };
        case 'SET_USERS':
            return {
                ...state,
                users: action.users,
            };
        case 'LOGOUT':
            return {
                ...state,
                loggedInUser: null,
            };
        default:
            return state;
    }
};
