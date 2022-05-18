import React from 'react';
import { useDispatch } from 'react-redux';
import useFormatters from './custom_hooks/useFormatters';
import { deleteCategory, postBudget } from '../store';
import { Link } from 'react-router-dom';
import NewCategoryForm from './NewCategoryForm';
import useData from './custom_hooks/useData';

export default function EditFixedCategories() {
  const { categories } = useData();
  const dispatch = useDispatch();
  const { dollarFormat } = useFormatters();

  const handleDelete = (cat) => {
    const vettedCategories = categories
      .filter((category) => {
        if (category.id === cat.id) {
          return false;
        } else {
          return true;
        }
      })
      .map((category, i) => ({ ...category, id: i }));
    console.log(vettedCategories);
    dispatch(postBudget({ categories: JSON.stringify(vettedCategories) }));
    // dispatch(deleteCategory(cat));
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
