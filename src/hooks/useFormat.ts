export const useFormat = () => {
  const fNumber = (n: number) => {
    return Intl.NumberFormat().format(n);
  };

  const fCurrency = (n: number) => {
    return Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(n);
  };

  return { fNumber, fCurrency };
};
