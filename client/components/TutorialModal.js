import React, { useState } from 'react';
import { setTutorial } from '../store';
import { useDispatch } from 'react-redux';
import history from '../history';

export default function TutorialModal() {
  const [slide, setSlide] = useState(1);
  function nextSlide() {
    setSlide((prevState) => prevState + 1);
  }
  const dispatch = useDispatch();
  document.body.style.overflow = 'hidden';
  return (
    <div id="tutorial">
      {slide === 1 ? (
        <div id="tut-panel" className="slide-one">
          <h1>Welcome to Billfold</h1>
          <h2>Let's get you up and folding</h2>
          <p>
            This is a quick tutorial to show you how to get your Billfold
            account set up. If you'd like to explore on your own, feel free to
            click 'skip' below! You can review this tutorial any time you like.
          </p>
          <h2 class="tut-button" onClick={nextSlide}>
            Get Started!
          </h2>
        </div>
      ) : (
        <></>
      )}
      {slide === 2 ? (
        <>
          <div
            className="tut-highlight my-info-light"
            onClick={() => {
              history.push('/myinfo');
              nextSlide();
            }}
          />
          <div id="tut-panel" className="slide-two">
            <h2>My Info</h2>
            <p>To get started creating your budget, click My Info</p>
          </div>
        </>
      ) : (
        <></>
      )}
      <h2
        id="tut-skip"
        onClick={() => {
          document.body.style.overflow = 'scroll';
          dispatch(setTutorial(false));
        }}
      >
        SKIP
      </h2>
    </div>
  );
}
