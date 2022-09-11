import axios from 'axios';

/**
 * ACTION TYPES
 */
const HOME_SET_LOADING = 'HOME_SET_LOADING';
const MONTH_SET_LOADING = 'MONTH_SET_LOADING';
const FIVE_SET_LOADING = 'FIVE_SET_LOADING';

/**
 * ACTION CREATORS
 */
export const homeSetLoading = (bool) => ({ type: HOME_SET_LOADING, bool });
export const monthSetLoading = (bool) => ({ type: MONTH_SET_LOADING, bool });
export const fiveSetLoading = (bool) => ({ type: FIVE_SET_LOADING, bool });

/**
 * REDUCER
 */
export default function loading(
  state = { homeChart: false, monthChart: false, fiveRecent: false },
  action
) {
  switch (action.type) {
    case HOME_SET_LOADING:
      return { ...state, homeChart: action.bool };
    case MONTH_SET_LOADING:
      return { ...state, monthChart: action.bool };
    case FIVE_SET_LOADING:
      return { ...state, fiveRecent: action.bool };
    default:
      return state;
  }
}
