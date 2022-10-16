import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postCategory } from '../store';
import singleCategory from '../store/singleCategory';

export default function NewCategoryForm(props) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState({
    name: '',
    rule: props.rule,
    amount: null,
    percent: null,
    startMonth: new Date().getMonth() + 1,
    startYear: new Date().getFullYear(),
    endMonth: null,
    endYear: null,
  });

  const handleChange = (evt) => {
    if (evt.target.name !== 'start' && evt.target.name !== 'end') {
      setCategory({
        ...category,
        [evt.target.name]: evt.target.value,
      });
    } else if (evt.target.name === 'start') {
      setCategory({
        ...category,
        startYear: Number(evt.target.value.split('-')[0]),
        startMonth: Number(evt.target.value.split('-')[1]),
      });
    } else {
      if (evt.target.value) {
        setCategory({
          ...category,
          endYear: Number(evt.target.value.split('-')[0]),
          endMonth: Number(evt.target.value.split('-')[1]),
        });
      } else {
        setCategory({
          ...category,
          endYear: null,
          endMonth: null,
        });
      }
    }
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    dispatch(
      postCategory({
        ...category,
        percent: Number(category.percent) / 100,
        amount: Number(category.amount),
      })
    );
  }

  return (
    <div className="form add-category-form">
      <h1>Add a New Category</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Description: </label>
        <input
          name="name"
          onChange={handleChange}
          type="text"
          value={category.name}
        />
        {props.rule === 'FIXED' ? (
          <div>
            <label htmlFor="amount">Amount: </label>
            <input
              name="amount"
              onChange={handleChange}
              type="number"
              value={`${category.amount}`}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="percent">Percentage: </label>
            <input
              name="percent"
              max="100"
              min="1"
              onChange={handleChange}
              type="number"
              value={`${category.percent}`}
            />
          </div>
        )}
        <p>
          This expense begins/began at the start of{' '}
          <input
            name="start"
            type="month"
            value={`${category.startYear}-${String(
              category.startMonth
            ).padStart(2, '0')}`}
            onChange={handleChange}
          />{' '}
          and ends/ended at the start of{' '}
          <input
            name="end"
            type="month"
            value={
              category.endYear
                ? `${category.endYear}-${String(category.endMonth).padStart(
                    2,
                    '0'
                  )}`
                : ''
            }
            onChange={handleChange}
          />{' '}
          (leave blank if ongoing)
        </p>
        <button type="submit">Finish</button>
      </form>
    </div>
  );
}
