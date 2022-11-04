import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteCategory, fetchAllCategories } from '../store';
import { Link } from 'react-router-dom';
import NewCategoryForm from './NewCategoryForm';
import getInsightGrabber from './custom_hooks/getInsights';
import { setInsights } from '../store';

export default function EditFlexibleCategories() {
  const data = useData();
  const { afterFixedCats } = data;
  const getInsights = getInsightGrabber();
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    state.allCategories.filter((cat) => cat.rule === 'PERCENT')
  );
  const { dollarFormat, seperateActive } = useFormatters();

  const handleDelete = (cat) => {
    dispatch(deleteCategory(cat));
  };

  const [active, inactive] = seperateActive(categories);

  useEffect(() => {
    dispatch(setInsights(getInsights()));
  }, [active.length, inactive.length]);

  return (
    <div>
      <NewCategoryForm rule="PERCENT" />
      {active.length ? (
        <>
          <h1>My Active Flexible Categories</h1>
          <div className="user-items">
            {active.map((cat) => (
              <div key={cat.id}>
                <h3>{cat.name}</h3>
                <p>
                  I aim to spend around {cat.percent * 100}% of my remaining
                  money on this each month.
                </p>
                <p>
                  That means about {dollarFormat(cat.percent * afterFixedCats)}.
                </p>
                <Link to={`/edit/categories/${cat.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {cat.startMonth}/{cat.startYear}
                  {cat.endMonth
                    ? ` - ${cat.endMonth}/${cat.endYear}`
                    : ' onward'}
                </p>
                <Link to={`/edit/categories/dates/${cat.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(cat)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      {inactive.length ? (
        <>
          <h1>My Inactive Flexible Categories</h1>
          <div className="user-items">
            {inactive.map((cat) => (
              <div key={cat.id} style={{ backgroundColor: 'gray' }}>
                <h3>{cat.name}</h3>
                <p>
                  I aim to spend around {cat.percent * 100}% of my remaining
                  money on this each month.
                </p>
                <Link to={`/edit/categories/${cat.id}`}>
                  <button type="button">Edit Details</button>
                </Link>
                <p>
                  {cat.startMonth}/{cat.startYear}
                  {cat.endMonth
                    ? ` - ${cat.endMonth}/${cat.endYear}`
                    : ' onward'}
                </p>
                <Link to={`/edit/categories/dates/${cat.id}`}>
                  <button type="button">Edit Date Range</button>
                </Link>
                <button type="button" onClick={() => handleDelete(cat)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
