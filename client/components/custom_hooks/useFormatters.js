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
  const seperateActive = function (items) {
    const active = [],
      inactive = [],
      today = new Date();
    for (let item of items) {
      if (
        new Date(item.startDate) <= today &&
        (item.endDate === null || new Date(item.endDate) > today)
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
