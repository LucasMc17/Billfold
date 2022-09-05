import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_CATS = 'SET_ALL_CATS';

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
    default:
      return state;
  }
}
