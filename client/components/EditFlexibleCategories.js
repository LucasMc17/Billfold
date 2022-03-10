import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useData from './custom_hooks/useData';
import useFormatters from './custom_hooks/useFormatters';
import { deleteCategory, fetchCategories } from '../store';

export default function EditFlexibleCategories() {
  const data = useData();
  const {afterFixedCats} = data;
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    state.categories.filter((cat) => cat.rule === 'PERCENT')
  );
  const { dollarFormat } = useFormatters();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const handleDelete = (cat) => {
    dispatch(deleteCategory(cat));
  };
  return (
    <div>
      {categories.map((cat) => (
        <div key={cat.id}>
          <h3>{cat.name}</h3>
          <p>
            I aim to spend around {cat.percent * 100}% of my remaining money on
            this each month.
          </p>
          <p>That means about {dollarFormat(cat.percent * afterFixedCats)}.</p>
          <button type="button" onClick={() => handleDelete(cat)}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}
