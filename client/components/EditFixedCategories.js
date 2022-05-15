import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFormatters from './custom_hooks/useFormatters';
import { deleteCategory, postBudget } from '../store';
import { Link } from 'react-router-dom';
import NewCategoryForm from './NewCategoryForm';

export default function EditFixedCategories() {
  const categories = useSelector((state) =>
    JSON.parse(state.currentBudget.categories)
  );
  const dispatch = useDispatch();
  const oldCategories = useSelector((state) =>
    state.categories.filter((cat) => cat.rule === 'FIXED')
  );
  const { dollarFormat } = useFormatters();

  const handleDelete = (cat) => {
    const vettedCategories = categories.filter((category) => {
      if (
        category.name === cat.name &&
        category.rule === cat.rule &&
        category.amount
          ? category.amount === cat.amount
          : category.percent === cat.percent
      ) {
        return false;
      } else {
        return true;
      }
    });
    dispatch(postBudget({ categories: JSON.stringify(vettedCategories) }));
    dispatch(deleteCategory(cat));
  };
  return (
    <div>
      <div className="user-items">
        {categories
          .filter((cat) => cat.rule === 'FIXED')
          .map((cat) => (
            <div key={cat.id}>
              <h3>{cat.name}</h3>
              <p>
                I want to spend at most {dollarFormat(cat.amount)} a month on
                this.
              </p>
              <Link to={`/edit/categories/${cat.id}`}>
                <button type="button">Edit</button>
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
