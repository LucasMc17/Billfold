import React, { useState } from 'react';
import { setTutorial } from '../store';
import { useDispatch } from 'react-redux';
import history from '../history';

export default function TutorialModal() {
  const [slide, setSlide] = useState(1);
  function nextSlide() {
    setSlide((prevState) => prevState + 1);
  }

  if ([1, 2].includes(slide)) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'scroll';
  }
  const dispatch = useDispatch();
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
      {slide === 3 ? (
        <>
          <div id="tut-panel" className="slide-three">
            <h2>My Info</h2>
            <p>
              <b>
                Don't worry, these numbers are just examples and not your data!
              </b>
            </p>
            <p>
              Billfold just needs a few things to be able to generate a budget
              for you:
            </p>
            <ul>
              <li>
                Yearly Incomes: You already defined one of these when you made
                your account but you can always edit it or add a new one later
              </li>
              <li>
                Yearly Expenses: expenses you pay once per year, like taxes or
                car insurance. These can be a dollar amount OR a percentage of
                your income
              </li>
              <li>
                Monthly Expenses: expenses you pay once per month, like rent or
                subscription services. These can be a dollar amount OR a
                percentage of your monthly net income
              </li>
              <li>
                Fixed Categories: whenever you log a purchase into Billfold, you
                will assign it a category. Fixed Categories are areas where you
                aim to spend a certain dollar amount per month, like $100 for
                laundry, or $50 on subway fares
              </li>
              <li>
                Flexible Categories: after Fixed Categories, the rest of your
                monthly budget gets divided up into Flexible Categories, which
                are a percentages of your remaining budget, like 40% for food or
                25% for fun
              </li>
            </ul>
            <p>
              As you enter each of these fields, Billfold will do the math in
              between automatically! Feel free to scroll through this example
              page and get a sense of how it works
            </p>
            <h2
              className="tut-button"
              onClick={() => {
                history.push('/edit/yearly-expenses');
                nextSlide();
              }}
            >
              Move on
            </h2>
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
