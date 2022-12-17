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
    window.scroll(0, 0);
  } else {
    document.body.style.overflow = 'scroll';
  }
  const dispatch = useDispatch();
  return (
    <>
      {slide === 0 ? (
        <div
          id="tut-start-button"
          onClick={() => {
            setSlide(1);
            history.push('/home');
            dispatch(setTutorial(true));
          }}
        >
          <h3>?</h3>
        </div>
      ) : (
        <div id="tutorial">
          {slide === 1 ? (
            <div id="tut-panel" className="slide-one">
              <h1>Welcome to Billfold</h1>
              <h2>Let's get you up and folding</h2>
              <p>
                This is a quick tutorial to show you how to get your Billfold
                account set up. If you'd like to explore on your own, feel free
                to click 'skip' below! You can review this tutorial any time you
                like.
                <br />
                For the sake of this tutorial, we'll be using a fake account
                with sample data
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
                    Don't worry, these numbers are just examples and not your
                    data!
                  </b>
                </p>
                <p>
                  Billfold just needs a few things to be able to generate a
                  budget for you:
                </p>
                <ul>
                  <li>
                    Yearly Incomes: You already defined one of these when you
                    made your account but you can always edit it or add a new
                    one later
                  </li>
                  <li>
                    Yearly Expenses: expenses you pay once per year, like taxes
                    or car insurance. These can be a dollar amount OR a
                    percentage of your income
                  </li>
                  <li>
                    Monthly Expenses: expenses you pay once per month, like rent
                    or subscription services. These can be a dollar amount OR a
                    percentage of your monthly net income
                  </li>
                  <li>
                    Fixed Categories: whenever you log a purchase into Billfold,
                    you will assign it a category. Fixed Categories are areas
                    where you aim to spend a certain dollar amount per month,
                    like $100 for laundry, or $50 on subway fares
                  </li>
                  <li>
                    Flexible Categories: after Fixed Categories, the rest of
                    your monthly budget gets divided up into Flexible
                    Categories, which are a percentages of your remaining
                    budget, like 40% for food or 25% for fun
                  </li>
                </ul>
                <p>
                  As you enter each of these fields, Billfold will do the math
                  in between automatically! Feel free to scroll through this
                  example page and get a sense of how it works
                </p>
                <h2
                  className="tut-button"
                  onClick={() => {
                    history.push('/edit/monthly-expenses');
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
          {slide === 4 ? (
            <div id="tut-panel" className="slide-four">
              <h2>Creating/editing expenses and categories</h2>
              <p>
                When you begin to edit any of these fields, you will see three
                things: a form to add a new item, a list of your currently
                active items, and a list of all your inactive items. These are
                any budget items whose end date has already passed, or whose
                start date is in the future. Here we can see that this user used
                to have a gym membership and a less expensive streaming service
              </p>
              <h2 className="tut-button" onClick={nextSlide}>
                Move on
              </h2>
            </div>
          ) : (
            <></>
          )}
          {slide === 5 ? (
            <div id="tut-panel" className="slide-five">
              <h2>Creating/editing expenses and categories</h2>
              <p>
                There are three buttons on each item, one to edit the details of
                the expense, one to edit the date range for which it is active,
                and one to delete the expense entirely.
              </p>
              <p>
                <b>NOTE:</b> be very certain before deleting an item, as this
                will remove it from your entire budget history. If an expense is
                no longer relevant, it's usually best to give it an end date,
                rather than retroactively deleting it from your budget
              </p>
              <h2
                className="tut-button"
                onClick={() => {
                  history.push('/edit/monthly-expenses/0');
                  nextSlide();
                }}
              >
                Move on
              </h2>
            </div>
          ) : (
            <></>
          )}
          {slide === 6 ? (
            <div id="tut-panel" className="slide-six">
              <h2>Editing an item's details</h2>
              <p>
                From this screen, you can edit the name and amount/percentage of
                a given budget item. You can also choose when the change goes
                into effect. If you set the change to go into effect on the same
                month that the initial item starts, it will overwrite the
                initial item for it's entire period of effect
              </p>
              <h2
                className="tut-button"
                onClick={() => {
                  history.push('/edit/monthly-expenses/dates/0');
                  nextSlide();
                }}
              >
                Move on
              </h2>
            </div>
          ) : (
            <></>
          )}
          {slide === 7 ? (
            <div id="tut-panel" className="slide-seven">
              <h2>Editing an item's date range</h2>
              <p>
                From this screen you can edit the start and end date of an
                expense. This is the best way to end an expense without
                retroactively changing your budget
              </p>
              <h2
                className="tut-button"
                onClick={() => {
                  history.push('/home');
                  nextSlide();
                }}
              >
                Move on
              </h2>
            </div>
          ) : (
            <></>
          )}
          {slide === 8 ? (
            <>
              <div id="tut-panel" className="slide-eight">
                <h2>Your Dashboard</h2>
                <p>
                  Or as we like to call it, your Billboard
                  <br />
                  This is the hub for all of your budget data! As you scroll
                  through, you'll notice
                </p>
                <ol>
                  <li>
                    An alert letting you know if your spending is on track
                  </li>
                  <li>
                    A list of your five most recent expenses and a form to add
                    new ones
                  </li>
                  <li>A chart showing your spending history</li>
                </ol>
                <h2
                  className="tut-button"
                  onClick={() => {
                    history.push('/year/0/month/0');
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
          {slide === 9 ? (
            <>
              <div id="tut-panel" className="slide-nine">
                <h2>This Month</h2>
                <p>
                  You can also view a detailed breakdown of any month, which
                  includes another chart showing how much of your budget you
                  spent in each category
                </p>
                <h2
                  className="tut-button"
                  onClick={() => {
                    history.push('/home');
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
          {slide === 10 ? (
            <>
              <div id="tut-panel" className="slide-ten">
                <h2>Other Features</h2>
                <p>
                  From the Navbar, you can select Billfold's other features,
                  including:
                  <ul>
                    <li>Exporting your budget history to an Excel file</li>
                    <li>Importing an Excel sheet into your Billfold account</li>
                    <li>
                      A historical view of your budget and how it has changed,
                      year over year
                    </li>
                    <li>
                      Billfold Insights: Billfold will automatically notify you
                      when it has suggestions for your spending
                    </li>
                  </ul>
                </p>
                <h2
                  className="tut-button"
                  onClick={() => {
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
          {slide === 11 ? (
            <>
              <div id="tut-panel" className="slide-eleven">
                <h2>Let's Get Folding!</h2>
                <p>That's enough tutorial, let's get started!</p>
                <h2
                  className="tut-button"
                  onClick={() => {
                    dispatch(setTutorial(false));
                  }}
                >
                  Let's Go!
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
              history.push('/home');
              dispatch(setTutorial(false));
              setSlide(0);
            }}
          >
            SKIP
          </h2>
        </div>
      )}
    </>
  );
}
