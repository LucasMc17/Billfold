import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFormatters from './custom_hooks/useFormatters';
import { deleteCategory } from '../store';
import { Link } from 'react-router-dom';
import NewCategoryForm from './NewCategoryForm';

export default function EditFixedCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    state.categories.filter((cat) => cat.rule === 'FIXED')
  );
  const { dollarFormat } = useFormatters();

  const handleDelete = (cat) => {
    dispatch(deleteCategory(cat));
  };
  return (
    <div>
      <div className="user-items">
        {categories.map((cat) => (
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
              {cat.endMonth ? ` - ${cat.endMonth}/${cat.endYear}` : ' onward'}
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
      <NewCategoryForm rule="FIXED" />
    </div>
  );
}
