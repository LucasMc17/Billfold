import React, { useState } from 'react';
import { postDaily } from '../store';
import readXlsxFile from 'read-excel-file';
import { useDispatch, useSelector } from 'react-redux';

export default function BulkUpload() {
  let r = 0;
  let u = 0;
  const dispatch = useDispatch();
  const categories = useSelector((state) =>
    state.categories.map((cat) => cat.name)
  );
  console.log(categories);
  const [error, setError] = useState('');
  const [uploads, setUploads] = useState(0);
  const [rejects, setRejects] = useState(0);

  function handleUpload() {
    const excelUpload = document.querySelector('#excel-upload');
    setUploads(0);
    setRejects(0);
    if (!excelUpload.files.length) {
      setError('No file chosen');
    } else if (excelUpload.files[0].name.endsWith('.xls')) {
      setError('Please make sure your file is a .xlsx');
    } else {
      r = 0;
      console.log(excelUpload.files);
      readXlsxFile(excelUpload.files[0]).then((rows) => {
        u = rows.length - 1;
        rows.slice(1).forEach((row) => {
          const [category, name, amount, date] = row;
          if (categories.includes(category)) {
            console.log({ category, name, amount, date });
            dispatch(postDaily({ category, name, amount, date }));
          } else {
            r++;
            console.log(r);
            setRejects(r);
            console.log(rejects);
          }
        });
      });
      setTimeout(() => {
        setError(`${u - r} purchases uploaded. ${r} purchases rejected.`);
      }, 500);
    }
  }

  return (
    <div id="bulk-upload">
      <h1>UPLOAD A FILE TO BILLFOLD</h1>
      <input type="file" id="excel-upload" />
      <input type="submit" onClick={handleUpload} />
      <h2>{error}</h2>
    </div>
  );
}
