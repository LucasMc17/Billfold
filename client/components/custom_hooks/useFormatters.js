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
  return {
    dollarFormat,
    fixedDec,
  };
}
