import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_AVAIL_CATS = 'SET_AVAIL_CATS';

/**
 * ACTION CREATORS
 */
const setAvailableCategories = (cats) => ({ type: SET_AVAIL_CATS, cats });

/**
 * THUNK CREATORS
 */
export const fetchAvailableCategories = (year, month) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/categories/${year}/${month}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setAvailableCategories(data));
  };
};

/**
 * REDUCER
 */
export default function availableCategories(state = [], action) {
  switch (action.type) {
    case SET_AVAIL_CATS:
      return action.cats;
    default:
      return state;
  }
}
