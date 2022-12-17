/**
 * ACTION TYPES
 */
const START_TUTORIAL = 'SET_TUTORIAL';
const END_TUTORIAL = 'END_TUTORIAL';
const NEXT_SLIDE = 'NEXT_SLIDE';

/**
 * ACTION CREATORS
 */
export const startTutorial = () => ({ type: START_TUTORIAL });
export const endTutorial = () => ({ type: END_TUTORIAL });
export const nextSlide = () => ({ type: NEXT_SLIDE });

/**
 * REDUCER
 */
export default function showTutorial(state = 0, action) {
  switch (action.type) {
    case START_TUTORIAL:
      return 1;
    case END_TUTORIAL:
      return 0;
    case NEXT_SLIDE:
      return state + 1;
    default:
      return state;
  }
}
