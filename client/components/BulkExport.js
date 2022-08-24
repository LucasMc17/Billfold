import React, { useState } from 'react';
import writeXlsxFile from 'write-excel-file';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';

export default function BulkExport() {
  const dailies = useSelector((state) => state.dailyExpenses);

  async function handleExport() {
    const rows = dailies
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
      fileName: 'billfold-export.xlsx',
    });

    saveAs(file, 'billfold-export.xlsx');
  }
  return (
    <div>
      <button onClick={handleExport}>EXPORT</button>
    </div>
  );
}
