import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_DEDUCTS = 'SET_ALL_DEDUCTS';
const ADD_DEDUCT = 'ADD_DEDUCT';
const DEL_DEDUCT = 'DEL_DEDUCT';

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
    case ADD_DEDUCT:
      return [...state, action.deduct];
    case DEL_DEDUCT:
      return state.filter((de) => de.id !== action.id);
    default:
      return state;
  }
}
