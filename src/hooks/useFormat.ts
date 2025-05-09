type FNumberOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

type FCurrencyOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export const useFormat = () => {
  const fNumber = (n: number, ops?: FNumberOptions) => {
    return Intl.NumberFormat(undefined, {
      ...ops,
    }).format(n);
  };

  const fCurrency = (n: number, ops?: FCurrencyOptions) => {
    return Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      ...ops,
    }).format(n);
  };

  return { fNumber, fCurrency };
};
