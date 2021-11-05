const isAuth = localStorage.getItem("userisauth");
const login = localStorage.getItem("userlogin");
const role = localStorage.getItem("userrole");
const id = localStorage.getItem("userid");
const initialState = {
    isAuth,
    login,
    role,
    id
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case 'SIGN_IN':
            localStorage.setItem("accesstoken", action.data.access_token)
            localStorage.setItem("userisauth", action.data.isAuth)
            localStorage.setItem("userid", action.data.id)
            localStorage.setItem("userlogin", action.data.login)
            localStorage.setItem("userrole", action.data.role)
            delete action.data.access_token

            return {
                ...state,
                ...action.data
            }
        case 'INFO_UPD':
            action.data.access_token !== undefined && localStorage.setItem("accesstoken", action.data.access_token)
            action.data.access_token !== undefined && delete action.data.access_token
            action.data.isAuth !== undefined && localStorage.setItem("userisauth", action.data.isAuth);
            action.data.id !== undefined && localStorage.setItem("userid", action.data.id);
            action.data.login !== undefined && localStorage.setItem("userlogin", action.data.login);
            action.data.role !== undefined && localStorage.setItem("userrole", action.data.role);

            return {
                ...state,
                ...action.data
            }
        case 'SIGN_OUT':
            localStorage.removeItem("accessToken")
            localStorage.removeItem("userisauth")
            localStorage.removeItem("userid")
            localStorage.removeItem("userlogin")
            localStorage.removeItem("userrole")

            return {
                isAuth: null
            }
        case 'AUTH_CHECK':

            return state
        default:
            return state

    }
}

