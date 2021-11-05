export const sign_in = (data) => dispatch => {
    dispatch({ type: 'SIGN_IN', data });
};
export const sign_out = (data) => dispatch => {
    dispatch({ type: 'SIGN_OUT', data });
};
export const info_upd = (data) => dispatch => {
    dispatch({ type: 'INFO_UPD', data });
};

export const local_auth_check = (data) => dispatch => {
    dispatch({ type: 'AUTH_CHECK', data });
};
