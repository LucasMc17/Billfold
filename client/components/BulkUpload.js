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
  const [error, setError] = useState('');

  function handleUpload() {
    const excelUpload = document.querySelector('#excel-upload');
    if (!excelUpload.files.length) {
      setError('No file chosen');
    } else if (excelUpload.files[0].name.endsWith('.xls')) {
      setError('Please make sure your file is a .xlsx');
    } else {
      r = 0;
      readXlsxFile(excelUpload.files[0]).then((rows) => {
        u = rows.length - 1;
        rows.slice(1).forEach((row) => {
          const [category, name, amount, date] = row;
          if (categories.includes(category)) {
            dispatch(postDaily({ category, name, amount, date }));
          } else {
            r++;
          }
          setError(`${u - r} purchases uploaded. ${r} purchases rejected.`);
        });
      });
    }
  }

  return (
    <div id="bulk-upload">
      <h1>Upload a File to Billfold</h1>
      <p>
        Have a lot of purchases to log? Or maybe you've been tracking your
        expenses in your own Excel file, and are finally ready to migrate it all
        to Billfold. Either way, you're in luck! Billfold supports bulk uploads
        in the form of .xlsx files. Read on to find out how!
      </p>
      <h2>Formatting Your Upload</h2>
      <p>
        First off, make sure you save your upload as an .xlsx file. Second, the
        first row of your sheet should be reserved for headers for each of the
        columns. These headers (in order) will be "Category," "Name," "Amount,"
        and "Date." In the first column, please enter your purchase's category.
        In the second, enter the purchase's name. In the third, enter the cost
        of the purchase. No need to include a dollar sign, just the number will
        do! Lastly, in the fourth column, enter the date of your purchase. Here
        is an example of a properly formatted bulk upload:
      </p>
      <img src="./billfold-upload-example.PNG" />
      <p>
        Note that the date can be formatted as either "MM/DD/YYYY" or
        "MM/DD/YY."
      </p>
      <h2>!!! A Note About Categories !!!</h2>
      <p>
        When performing a bulk upload to Billfold, be extra careful to ensure
        that your categories column is consistent with the names of the
        categories you've created on Billfold. This includes watching typos and
        capitalization. For example, if you have a category on Billfold named
        "laundry", then every deal in your upload in that category must have its
        category column entered as "laundry", not "Laundry", "laundry ",
        "landry" or any other permutation. Billfold will not upload a purchase
        if it cannot locate a corresponding category name, nor will it accept
        any purchase missing any of the four pieces of information outlined
        above.
      </p>
      <p>
        After every upload, a message will be displayed informing you how many
        of the purchases were succesfully uploaded and how many were rejected.
        To get the rest of the purchases uploaded, take a second look at the
        category column, and double check for any missing information, before
        again trying to upload JUST those purchases that did not go through the
        first time. Uploading the whole sheet again may result in duplicate
        purchases!
      </p>
      <input type="file" id="excel-upload" />
      <input type="submit" onClick={handleUpload} />
      <h2>{error}</h2>
    </div>
  );
}
