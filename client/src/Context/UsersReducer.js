// REDUCER SPECIFY STATE CHANGEs AND ACTIONS
export default (state, action) => {
    switch (action.type) {
        case 'NEW_MESSAGE':
            return {
                ...state,
                msg: action.payload
            }

        case 'CLEAR_MESSAGE':
            return {
                ...state,
                msg: ''
            }

        case 'FETCH_USER_SUCCESS':
            return {
                ...state,
                user: action.payload
            }
        case 'FETCH_USER_ERROR':
            return {
                ...state,
                user: {
                    role: 'user',
                    _id: 0,
                    fname: '',
                    lname: '',
                    email: '',
                    username: '',
                    createdAt: ''
                }
            }
        // IF THE ACTION IS EMPY RETURN THE DEFAULT STATE
        default:
            return state;
    }
}