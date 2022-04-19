function formatDate(date: Date, formatString = 'dd/MM/yyyy'): string {
  let result = formatString;

  const format = [
    {
      symbol: 'dd',
      value: date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
    },
    {
      symbol: 'MM',
      value: date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`,
    },
    {
      symbol: 'yyyy',
      value: date.getFullYear(),
    },
    {
      symbol: 'hh',
      value: date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
    },
    {
      symbol: 'mm',
      value: date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
    },
  ];

  format.map((f) => {
    result = result.replace(f.symbol, f.value as string);
    return f.symbol;
  });

  return result;
}

function formatMoney(value: number, frac = 0): string {
  const numberFormat = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: frac, minimumFractionDigits: frac });
  return numberFormat.format(value);
}

const format = {
  formatDate,
  formatMoney,
};

export default format;
