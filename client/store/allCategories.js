import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_CATS = 'SET_ALL_CATS';
const ADD_CAT = 'ADD_CAT';
const DEL_CAT = 'DEL_CAT';

/**
 * ACTION CREATORS
 */
const setAllCategories = (cats) => ({ type: SET_ALL_CATS, cats });

/**
 * THUNK CREATORS
 */
export const fetchAllCategories = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/all-categories`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setAllCategories(data));
  };
};

/**
 * REDUCER
 */
export default function allCategories(state = [], action) {
  switch (action.type) {
    case SET_ALL_CATS:
      return action.cats;
    case ADD_CAT:
      return [...state, action.category];
    case DEL_CAT:
      return state.filter((cat) => cat.id !== action.id);
    default:
      return state;
  }
}
