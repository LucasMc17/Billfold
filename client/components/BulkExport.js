import React, { useState, useEffect } from 'react';
import writeXlsxFile from 'write-excel-file';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';

export default function BulkExport() {
  const dailies = useSelector((state) => state.dailyExpenses);
  const [exports, setExports] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setExports(dailies);
  }, []);

  async function handleExport() {
    setLoading(true);
    const rows = exports
      .map((d) => [
        { type: String, value: d.category.name },
        { type: String, value: d.name },
        { type: Number, value: d.amount },
        { type: Date, value: new Date(d.date), format: 'mm/dd/yyyy' },
      ])
      .sort((a, b) => {
        return a[3].value - b[3].value;
      });
    const exportData = [
      [
        { value: 'Categroy' },
        { value: 'Name' },
        { value: 'Amount' },
        { value: 'Date' },
      ],
      ...rows,
    ];
    const file = await writeXlsxFile(exportData, {
      fileName: `billfold-export${
        dateRange.startDate ? '-from-' + dateRange.startDate : ''
      }${dateRange.endDate ? '-to-' + dateRange.endDate : ''}.xlsx`,
    });
    setLoading(false);

    saveAs(file);
  }

  function handleDateChange(event) {
    const { name, value } = event.target;
    setDateRange((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  useEffect(() => {
    const { startDate, endDate } = dateRange;
    if (startDate && endDate) {
      setExports(
        dailies.filter((d) => d.date >= startDate && d.date <= endDate)
      );
    } else if (startDate) {
      setExports(dailies.filter((d) => d.date >= startDate));
    } else if (endDate) {
      setExports(dailies.filter((d) => d.date <= endDate));
    } else {
      setExports(dailies);
    }
  }, [dateRange]);

  return (
    <div id="bulk-export">
      <h1>Billfold supports data exporting!</h1>
      <p>
        Need to put those purchases into a .xlsx file? Billfold makes it easy!
        Choose a date range, then click export to download an excel file of your
        purchases, already formatted for bulk upload.
      </p>
      <p>
        NOTE: if you leave the starting date empty, your export will include all
        your purchases up to your ending date. Leave the ending date empty to
        export all purchases from your starting date onwards. Leave both fields
        empty to export all your purchases in one sheet.
      </p>
      <div id="export-form">
        <p>export all purchases from</p>
        <input
          name="startDate"
          onChange={handleDateChange}
          value={dateRange.startDate}
          type="date"
        ></input>
        <p>to</p>
        <input
          onChange={handleDateChange}
          name="endDate"
          value={dateRange.endDate}
          type="date"
        ></input>
      </div>
      <h3>Export {exports.length} purchases</h3>
      <button onClick={handleExport}>EXPORT</button>
      {loading ? <h3>exporting...</h3> : ''}
    </div>
  );
}
