import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_CATS = 'SET_CATS';
const DEL_CAT = 'DEL_CAT';
const ADD_CAT = 'ADD_CAT';
const UPDATE_CAT = 'UPDATE_CAT';

/**
 * ACTION CREATORS
 */
const setCategories = (cats) => ({ type: SET_CATS, cats });
const delCategory = (id) => ({ type: DEL_CAT, id });
const addCategory = (category) => ({ type: ADD_CAT, category });
const updateCategory = (categories) => ({ type: UPDATE_CAT, categories });

/**
 * THUNK CREATORS
 */
export const fetchCategories = (year, month) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/categories/${year}/${month}`, {
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

export const patchCategory = (cat) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.put(`/api/categories/${cat.id}`, cat, {
      headers: { authorization: token },
    });
    dispatch(updateCategory(data));
  };
};

export const postCategory = (cat) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.post('/api/categories', cat, {
      headers: { authorization: token },
    });
    dispatch(addCategory(data));
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
    case ADD_CAT:
      return [...state, action.category];
    case UPDATE_CAT:
      const [oldCat, newCat] = action.categories;
      const newState = state.map((cat) => {
        if (cat.id === oldCat.id) {
          return oldCat;
        } else {
          return cat;
        }
      });
      if (!newCat) {
        return newState;
      } else {
        return [...newState, newCat];
      }
    default:
      return state;
  }
}
