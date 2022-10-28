export default function useFormatters() {
  const dollarFormat = function (amt) {
    return amt.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  const fixedDec = function (num) {
    return num.toFixed(2);
  };
  const seperateActive = function (items, date = new Date()) {
    const active = [],
      inactive = [];
    for (let item of items) {
      if (
        new Date(item.startDate) <= date &&
        (item.endDate === null || new Date(item.endDate) > date)
      ) {
        active.push(item);
      } else {
        inactive.push(item);
      }
    }
    return [active, inactive];
  };
  const condenseTracks = (array, year) => {
    if (array.length) {
      const result = array.map((arr) => [arr]);
      for (let i = 0; i < array.length; i++) {
        const curr = result[i];
        const remainder = result.slice(i + 1);
        const toCondense = remainder.findIndex(
          (item) =>
            item[0].startYear === year &&
            item[0].startMonth === curr[curr.length - 1].endMonth
        );
        if (toCondense !== -1) {
          result[i] = [...result[i], ...remainder[toCondense]];
          result.splice(1 + i + toCondense, 1);
          i--;
        }
      }
      return result;
    }
    return [];
  };
  return {
    dollarFormat,
    fixedDec,
    seperateActive,
    condenseTracks,
  };
}
