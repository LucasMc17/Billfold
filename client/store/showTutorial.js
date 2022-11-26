/**
 * ACTION TYPES
 */
const SET_TUTORIAL = 'SET_TUTORIAL';

/**
 * ACTION CREATORS
 */
export const setTutorial = (bool) => ({ type: SET_TUTORIAL, bool });

/**
 * REDUCER
 */
export default function showTutorial(state = true, action) {
  switch (action.type) {
    case SET_TUTORIAL:
      return action.bool;
    default:
      return state;
  }
}
