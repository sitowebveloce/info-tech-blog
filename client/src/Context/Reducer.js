// REDUCER SPECIFY STATE CHANGEs AND ACTIONS
export default (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                loading: false,
                fetchError: '',
                next: action.payload.pagination.next,
                prev: action.payload.pagination.prev,
                posts: action.payload.posts
            }
        case 'FETCH_SEARCH_SUCCESS':
            return {
                loading: false,
                fetchError: '',
                posts: action.payload.posts
            }
        case 'FETCH_ERROR':
            return {
                loading: false,
                fetchError: 'Wrong, login first',
                posts: []
            }
        case 'UPDATE_ERROR':
            return {
                loading: false,
                fetchError: 'Something went wrong'
            };


        // case 'DELETE_POST':
        //     return {
        //         ...state,
        //         posts: state.posts.filter(post => post._id !== action.payload)
        //     }

        // case 'ADD_POST':
        //     return {
        //         ...state,
        //         posts: [action.payload, ...state.posts]
        //     }

        // IF THE ACTION IS EMPY RETURN THE DEFAULT STATE
        default:
            return state;
    }
}