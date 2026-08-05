const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

/** Formats an amount with the symbol for the given currency code, falling back to the code itself if unknown. */
export function formatCurrency(amount, currencyCode) {
  const symbol = CURRENCY_SYMBOLS[currencyCode] ?? `${currencyCode ?? ""} `;
  return `${symbol}${Number(amount).toLocaleString()}`;
}
