import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_CATEGORY = 'SET_CATEGORY';

/**
 * ACTION CREATORS
 */
const setCategory = (category) => ({ type: SET_CATEGORY, category });

/**
 * THUNK CREATORS
 */
export const fetchCategory = (id) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/categories/${id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setCategory(data));
  };
};

/**
 * REDUCER
 */
export default function singleCategory(state = {}, action) {
  switch (action.type) {
    case SET_CATEGORY:
      return action.category;
    default:
      return state;
  }
}
