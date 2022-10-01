import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_DEDUCTS = 'SET_ALL_DEDUCTS';

/**
 * ACTION CREATORS
 */
const setAllDeducts = (deducts) => ({ type: SET_ALL_DEDUCTS, deducts });

/**
 * THUNK CREATORS
 */
export const fetchAllDeducts = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/all-deducts`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setAllDeducts(data));
  };
};

/**
 * REDUCER
 */
export default function allDeducts(state = [], action) {
  switch (action.type) {
    case SET_ALL_DEDUCTS:
      return action.deducts;
    default:
      return state;
  }
}
