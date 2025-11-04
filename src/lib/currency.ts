export function getRupiahCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function getShortRupiahCurrency(value: number): string {
  // Return not a number
  if (isNaN(value)) {
    return "Rp 0";
  }

  const units = ["", "ribu", "juta", "miliar", "triliun", "kuadriliun"];

  // Handle Negative Number
  const isNegative = value < 0;
  // Temporary change negative number to positive for calculation
  value = Math.abs(value);

  // Return value under 1 thousand
  if (value < 1000) {
    return `Rp ${isNegative ? "-" : ""}${value.toLocaleString("id-ID")}`;
  }

  // Define unit based on log10 algorithm
  const exponent = Math.floor(Math.log10(value) / 3);
  const unit = units[exponent] || "";

  // Shrink number to scale from 3.200.000 to 3,2
  const scaled = value / Math.pow(1000, exponent);

  // Conditional Decimal
  const formatted =
    scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1).replace(".0", "");

  return `Rp ${isNegative ? "-" : ""}${formatted} ${unit}`;
}
