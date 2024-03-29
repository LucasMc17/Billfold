import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { Link } from 'react-router-dom';
import {
  updateUnassigned,
  fetchAllIncomes,
  fetchAllCategories,
  fetchAllDeducts,
  fetchAllExpenses,
} from '../store';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Tooltip, PieController } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, PieController);

export default function MyInfo() {
  const dispatch = useDispatch();
  const { dollarFormat, fixedDec, seperateActive } = useFormatters();
  const data = useData();
  const tut = useSelector((state) => state.showTutorial);
  // const incomes = seperateActive(useSelector((state) => state.allIncomes))[0];
  // const activeYearlies = seperateActive(
  //   useSelector((state) => state.allDeducts)
  // )[0];
  // const activeMonthlies = seperateActive(
  //   useSelector((state) => state.allExpenses)
  // )[0];
  // const activeCategories = seperateActive(
  //   useSelector((state) => state.allCategories)
  // )[0];
  // const activeFixedCategories = activeCategories.filter(
  //   (cat) => cat.rule === 'FIXED'
  // );
  // const activeFlexibleCategories = activeCategories.filter(
  //   (cat) => cat.rule === 'PERCENT'
  // );

  useEffect(() => {
    dispatch(fetchAllIncomes());
    dispatch(fetchAllCategories());
    dispatch(fetchAllDeducts());
    dispatch(fetchAllExpenses());
  }, []);

  const {
    username,
    income,
    incomes,
    deducts,
    afterDeducts,
    monthlyNet,
    expenses,
    afterExpenses,
    fixedCats,
    afterFixedCats,
    unfixedCats,
    unassigned,
  } = data;
  const chartRef = useRef();
  const [state, setState] = useState({
    name: 'Click on a slice to see more!',
    perYear: null,
  });

  const handleHover = (e) => {
    const currentSlice = getElementAtEvent(chartRef.current, e)[0];
    const list = [...deducts, ...expenses, ...fixedCats, ...unfixedCats];
    setState({
      name: list[currentSlice.index].name,
      perYear: currentSlice.element.$context.parsed,
    });
  };

  dispatch(updateUnassigned(unassigned));

  return (
    <div>
      <div className="user-story first">
        <h1>
          Hi, my name is <span>{tut ? 'John Doe' : username}</span>
        </h1>
        <Link to="/edit/basic-info">
          <button type="button">Edit My Username</button>
        </Link>
        <h1>Here are my sources of income:</h1>
        <div className="user-items">
          {tut ? (
            <div>
              <h3>$60,000.00</h3>
              <p>1/2021 onward</p>
            </div>
          ) : incomes.length ? (
            incomes.map((inc) => (
              <div key={inc.id}>
                <h3>{dollarFormat(inc.amount)}</h3>
                <p>
                  {inc.startMonth}/{inc.startYear}
                  {inc.endMonth
                    ? ` - ${inc.endMonth}/${inc.endYear}`
                    : ' onward'}
                </p>
              </div>
            ))
          ) : (
            <h2>You don't have any incomes at the moment!</h2>
          )}
        </div>
        <h1>
          That comes to {tut ? '$60,000.00' : dollarFormat(income)} per year.
        </h1>
        <Link to="/edit/incomes">
          <button type="button">Edit My Incomes</button>
        </Link>
      </div>
      <div className="user-story">
        <h1>These are my yearly expenses:</h1>
        <p>
          NOTE: these expenses are calculated in order, meaning a 10% deduction
          isn't ten percent of your total income, but of your income minus all
          prior expenses
        </p>
        <div className="user-items">
          {tut ? (
            <>
              <div>
                <h3>Taxes</h3>
                <p>15% of my earnings</p>
                <p>1/2021 onward</p>
              </div>
              <div>
                <h3>Pet Insurance</h3>
                <p>$250.00</p>
                <p>7/2021 onward</p>
              </div>
            </>
          ) : deducts.length ? (
            deducts.map((de) => (
              <div key={de.id}>
                <h3>{de.name}</h3>
                <p>
                  {de.percent
                    ? `${de.percent * 100}% of my earnings`
                    : dollarFormat(de.amount)}
                </p>
                <p>
                  {de.startMonth}/{de.startYear}
                  {de.endMonth ? ` - ${de.endMonth}/${de.endYear}` : ' onward'}
                </p>
              </div>
            ))
          ) : (
            <h2>You don't have any yearly expenses yet!</h2>
          )}
        </div>
        <Link to="/edit/yearly-expenses">
          <button type="button">Edit my Yearly Expenses</button>
        </Link>
      </div>
      <div className="user-story">
        <h1>
          After expenses, I make{' '}
          {tut ? '$50,750.00' : dollarFormat(afterDeducts)} a year.
        </h1>
        <h1>That's {tut ? '$4,229.17' : dollarFormat(monthlyNet)} a month.</h1>
        <h1>These are my monthly expenses:</h1>
        <p>
          NOTE: these expenses are calculated in order, meaning a 10% deduction
          isn't ten percent of your total monthly net, but of your monthly net
          minus all prior expenses
        </p>
      </div>
      <div className="user-items">
        {tut ? (
          <>
            <div>
              <h3>Savings</h3>
              <p>25% of my monthly net</p>
              <p>1/2021 onward</p>
            </div>
            <div>
              <h3>Rent</h3>
              <p>$900.00</p>
              <p>1/2021 onward</p>
            </div>
            <div>
              <h3>Movie streaming</h3>
              <p>$15.00</p>
              <p>3/2021 onward</p>
            </div>
          </>
        ) : expenses.length ? (
          expenses.map((ex) => (
            <div key={ex.id}>
              <h3>{ex.name}</h3>
              <p>
                {ex.percent
                  ? `${ex.percent * 100}% of my monthly net`
                  : dollarFormat(ex.amount)}
              </p>
              <p>
                {ex.startMonth}/{ex.startYear}
                {ex.endMonth ? ` - ${ex.endMonth}/${ex.endYear}` : ' onward'}
              </p>
            </div>
          ))
        ) : (
          <h2>You don't have any monthly expenses yet!</h2>
        )}
      </div>
      <Link to="/edit/monthly-expenses">
        <button type="button">Edit my Monthly Expenses</button>
      </Link>
      <div className="user-story">
        <h1>
          After those expenses, I make{' '}
          {tut ? '$2256.88' : dollarFormat(afterExpenses)} a month.
        </h1>
        <h1>These are my fixed spending categories each month:</h1>
      </div>
      <div className="user-items">
        {tut ? (
          <>
            <div>
              <h3>Laundry</h3>
              <p>I want to spend at most $100.00 a month on this.</p>
              <p>6/2021 onward</p>
            </div>
            <div>
              <h3>Subway</h3>
              <p>I want to spend at most $50.00 a month on this.</p>
              <p>1/2021 onward</p>
            </div>
          </>
        ) : fixedCats.length ? (
          fixedCats.map((cat) => (
            <div key={cat.id}>
              <h3>{cat.name}</h3>
              <p>
                I want to spend at most {dollarFormat(cat.amount)} a month on
                this.
              </p>
              <p>
                {cat.startMonth}/{cat.startYear}
                {cat.endMonth ? ` - ${cat.endMonth}/${cat.endYear}` : ' onward'}
              </p>
            </div>
          ))
        ) : (
          <h2>You don't have any fixed spending categories yet!</h2>
        )}
      </div>
      <Link to="/edit/fixed-categories">
        <button type="button">Edit my Fixed Categories</button>
      </Link>
      <div className="user-story">
        <h1>
          That leaves me with {tut ? '$2,106.88' : dollarFormat(afterFixedCats)}{' '}
          for my flexible spending categories:
        </h1>
      </div>
      <div className="user-items">
        {tut ? (
          <>
            <div>
              <h3>Food</h3>
              <p>
                I aim to spend around 40% of my remaining money on this each
                month.
              </p>
              <p>That means about $842.78.</p>
              <p>1/2021 onward</p>
            </div>
            <div>
              <h3>Fun</h3>
              <p>
                I aim to spend around 25% of my remaining money on this each
                month.
              </p>
              <p>That means about $526.72.</p>
              <p>1/2021 onward</p>
            </div>
            <div>
              <h3>Home goods</h3>
              <p>
                I aim to spend around 20% of my remaining money on this each
                month.
              </p>
              <p>That means about $421.38.</p>
              <p>1/2021 onward</p>
            </div>
            <div>
              <h3>Self care</h3>
              <p>
                I aim to spend around 15% of my remaining money on this each
                month.
              </p>
              <p>That means about $316.03.</p>
              <p>1/2021 onward</p>
            </div>
          </>
        ) : unfixedCats.length ? (
          unfixedCats.map((cat) => (
            <div key={cat.id}>
              <h3>{cat.name}</h3>
              <p>
                I aim to spend around {cat.percent * 100}% of my remaining money
                on this each month.
              </p>
              <p>
                That means about {dollarFormat(cat.percent * afterFixedCats)}.
              </p>
              <p>
                {cat.startMonth}/{cat.startYear}
                {cat.endMonth ? ` - ${cat.endMonth}/${cat.endYear}` : ' onward'}
              </p>
            </div>
          ))
        ) : (
          <h2>You don't have any flexible spending categories yet!</h2>
        )}
        {unassigned && !tut ? (
          <div id="unassigned-cat">
            <h3>Unassigned</h3>
            <p>
              This is an automatic category for all the money you haven't yet
              assigned.
            </p>
            <p>{`You have ${dollarFormat(unassigned)} (${
              fixedDec(unassigned / afterFixedCats) * 100
            }% of your remaining income after fixed categories) to assign.`}</p>
          </div>
        ) : (
          ''
        )}
      </div>
      <Link to="/edit/flexible-categories">
        <button type="button">Edit my Flexible Categories</button>
      </Link>
      <div className="chart-container" id="info-chart">
        <div>
          <h1>My spending:</h1>
          <div id="legend">
            <div className="legend-section">
              <square style={{ backgroundColor: '#01161E' }} />
              <p>Yearly Expenses</p>
            </div>
            <div className="legend-section">
              <square style={{ backgroundColor: '#124559' }} />
              <p>Monthly Expenses</p>
            </div>
            <div className="legend-section">
              <square style={{ backgroundColor: '#598392' }} />
              <p>Fixed Categories</p>
            </div>
            <div className="legend-section">
              <square style={{ backgroundColor: '#AEC3B0' }} />
              <p>Unfixed Categories</p>
            </div>
          </div>
          <div id="pie-slice-info">
            <h1>{state.name}</h1>
            <h2>
              {state.perYear
                ? `${dollarFormat(
                    state.perYear / 12
                  )} per month, or ${dollarFormat(state.perYear)} per year.`
                : ''}
            </h2>
          </div>
        </div>
        <div>
          <Chart
            width="50%"
            type="pie"
            onClick={handleHover}
            ref={chartRef}
            data={
              tut
                ? {
                    labels: [
                      'Taxes',
                      'Pet Insurance',
                      'Savings',
                      'Rent',
                      'Movie streaming',
                      'Laundry',
                      'Subway',
                      'Food',
                      'Fun',
                      'Home goods',
                      'Self care',
                    ],
                    datasets: [
                      {
                        label: 'Dollars spent each year: ',
                        data: [
                          9000, 250, 12687.51, 10800, 180, 1200, 600, 10113.36,
                          6320.64, 5056.56, 3792.36,
                        ],
                        backgroundColor: [
                          '#01161E',
                          '#01161E',
                          '#124559',
                          '#124559',
                          '#124559',
                          '#598392',
                          '#598392',
                          '#AEC3B0',
                          '#AEC3B0',
                          '#AEC3B0',
                          '#AEC3B0',
                        ],
                        borderColor: 'black',
                        borderWidth: 3,
                      },
                    ],
                  }
                : {
                    labels: [
                      ...deducts.map((de) => de.name),
                      ...expenses.map((ex) => ex.name),
                      ...fixedCats.map((cat) => cat.name),
                      ...unfixedCats.map((cat) => cat.name),
                    ],
                    datasets: [
                      {
                        label: 'Dollars spent each year: ',
                        data: [
                          ...deducts.map(
                            (de) => de.amount || de.percent * income
                          ),
                          ...expenses.map(
                            (ex) => (ex.amount || ex.percent * monthlyNet) * 12
                          ),
                          ...fixedCats.map((cat) => cat.amount * 12),
                          ...unfixedCats.map(
                            (cat) => cat.percent * afterFixedCats * 12
                          ),
                        ],
                        backgroundColor: [
                          ...deducts.map((de) => '#01161E'),
                          ...expenses.map((ex) => '#124559'),
                          ...fixedCats.map((cat) => '#598392'),
                          ...unfixedCats.map((cat) => '#AEC3B0'),
                        ],
                        borderColor: 'black',
                        borderWidth: 3,
                      },
                    ],
                  }
            }
          />
        </div>
      </div>
    </div>
  );
}
