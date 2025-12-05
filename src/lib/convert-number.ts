export function toNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value);
  if (
    typeof value === "object" &&
    "toNumber" in value &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }
  return Number(value);
}

export function getShortNumber(value: number): string {
  // Return not a number
  if (isNaN(value)) {
    return "0";
  }

  const units = ["", "ribu", "juta", "miliar", "triliun", "kuadriliun"];

  // Handle Negative Number
  const isNegative = value < 0;
  // Temporary change negative number to positive for calculation
  value = Math.abs(value);

  // Return value under 1 thousand
  if (value < 1000) {
    return `${isNegative ? "-" : ""}${value.toLocaleString("id-ID")}`;
  }

  // Define unit based on log10 algorithm
  const exponent = Math.floor(Math.log10(value) / 3);
  const unit = units[exponent] || "";

  // Shrink number to scale from 3.200.000 to 3,2
  const scaled = value / Math.pow(1000, exponent);

  // Conditional Decimal
  const formatted =
    scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1).replace(".0", "");

  return `${isNegative ? "-" : ""}${formatted} ${unit}`;
}

// Scale -5 to 5 become a percent
// -5→0%, 0→50%, 5→100%
export function scaleToPercent(value: number) {
  return ((value + 5) / 10) * 100;
}

export function formatWithComma(value: any): string {
  const num = toNumber(value);
  if (num === null || isNaN(num)) return "0";

  return num.toLocaleString("id-ID");
}
