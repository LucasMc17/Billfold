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
  return {
    dollarFormat,
    fixedDec,
    seperateActive,
  };
}
