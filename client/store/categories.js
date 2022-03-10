import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_CATS = 'SET_CATS';
const DEL_CAT = 'DEL_CAT';

/**
 * ACTION CREATORS
 */
const setCategories = (cats) => ({ type: SET_CATS, cats });
const delCategory = (id) => ({ type: DEL_CAT, id });

/**
 * THUNK CREATORS
 */
export const fetchCategories = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get('/api/categories', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setCategories(data));
  };
};

export const deleteCategory = (cat) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    await axios.delete(`/api/categories/${cat.id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(delCategory(cat.id));
  };
};

/**
 * REDUCER
 */
export default function categories(state = [], action) {
  switch (action.type) {
    case SET_CATS:
      return action.cats;
    case DEL_CAT:
      return state.filter((cat) => cat.id !== action.id);
    default:
      return state;
  }
}
