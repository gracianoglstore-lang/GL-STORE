export const formatCurrency = (value: number, currency: string = 'AOA', locale: string = 'pt-AO'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(value);
};
