export function getRupiahCurrency(value: number): string {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const formatted = formatter.format(value);

  /*
   * CLDR has an issue regarding number format for Indonesian language (id):
   * https://www.unicode.org/cldr/charts/48/summary/id.html#6154e7673c3829ce
   * https://st.unicode.org/cldr-apps/v#/id/Number_Formatting_Patterns/6154e7673c3829ce
   * Correct format:
   * https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/angka-dan-bilangan/
   */
  return formatted.replace("\u00a0", "");
}

export function getShortRupiahCurrency(value: number): string {
  // Return not a number
  if (isNaN(value)) {
    return "Rp0";
  }

  const units = ["", "ribu", "juta", "miliar", "triliun", "kuadriliun"];

  // Handle Negative Number
  const isNegative = value < 0;
  // Temporary change negative number to positive for calculation
  value = Math.abs(value);

  // Return value under 1 thousand
  if (value < 1000) {
    return `${isNegative ? "-" : ""}Rp${value.toLocaleString("id-ID")}`;
  }

  // Define unit based on log10 algorithm
  const exponent = Math.floor(Math.log10(value) / 3);
  const unit = units[exponent] || "";

  // Shrink number to scale from 3.200.000 to 3,2
  const scaled = value / Math.pow(1000, exponent);

  // Conditional Decimal
  const formatted =
    scaled % 1 === 0
      ? scaled.toFixed(0)
      : scaled.toFixed(1).replace(".0", "").replace(".", ",");

  return `${isNegative ? "-" : ""}Rp${formatted} ${unit}`;
}
