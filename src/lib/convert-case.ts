export function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // camelCase → camel_Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2") // ABCName → ABC_Name
    .replace(/[\s\-]+/g, "_") // spaces & dashes → _
    .replace(/[^a-zA-Z0-9_]/g, "") // remove special chars
    .toLowerCase();
}

export function toCamelCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // pisah camel/PascalCase jadi kata
    .replace(/[_\-\s]+/g, " ") // normalize delimiters jadi spasi
    .toLowerCase()
    .replace(/ (.)/g, (_, char) => char.toUpperCase()); // kapitalisasi kata ke-2 dst
}
