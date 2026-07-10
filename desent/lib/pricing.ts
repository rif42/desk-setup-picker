export const CURRENCY = "IDR" as const;

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

/** Format a monthly price in Indonesian Rupiah. */
export function formatIDR(amount: number) {
  return idr.format(amount);
}
