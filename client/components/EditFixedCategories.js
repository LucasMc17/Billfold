import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFormatters from './custom_hooks/useFormatters';
import { deleteCategory, fetchAllCategories } from '../store';
import { Link } from 'react-router-dom';
import NewCategoryForm from './NewCategoryForm';

export default function EditFixedCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    state.allCategories.filter((cat) => cat.rule === 'FIXED')
  );
  const { dollarFormat, seperateActive } = useFormatters();

  const handleDelete = (cat) => {
    dispatch(deleteCategory(cat));
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);

  const [active, inactive] = seperateActive(categories);

  return (
    <div>
      <NewCategoryForm rule="FIXED" />
      {active.length ? (
        <>
          <h1>My Active Fixed Categories</h1>
          <div className="user-items">
            {active.map((cat) => (
              <div key={cat.id}>
                <h3>{cat.name}</h3>
                <p>
                  I want to spend at most {dollarFormat(cat.amount)} a month on
                  this.
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
          <h1>My Inactive Fixed Categories</h1>
          <div className="user-items">
            {inactive.map((cat) => (
              <div key={cat.id} style={{ backgroundColor: 'gray' }}>
                <h3>{cat.name}</h3>
                <p>
                  I want to spend at most {dollarFormat(cat.amount)} a month on
                  this.
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
