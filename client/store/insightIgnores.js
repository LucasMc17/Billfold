import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_IGNORES = 'SET_IGNORES';
const ADD_IGNORE = 'ADD_IGNORE';

/**
 * ACTION CREATORS
 */
const setIgnores = (ignores) => ({ type: SET_IGNORES, ignores });
const addIgnore = (ignore) => ({ type: ADD_IGNORE, ignore });

/**
 * THUNK CREATORS
 */
export const fetchIgnores = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get('/api/insight-ignores', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setIgnores(data));
  };
};

export const postIgnore = (ignore) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.post('/api/insight-ignores', ignore, {
      headers: {
        authorization: token,
      },
    });
    dispatch(addIgnore(data));
  };
};

/**
 * REDUCER
 */
export default function insightIgnores(state = [], action) {
  switch (action.type) {
    case SET_IGNORES:
      return action.ignores;
    case ADD_IGNORE:
      return [...state, action.ignore];
    default:
      return state;
  }
}
