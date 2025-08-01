export function toCamelCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // pisah camel/PascalCase jadi kata
    .replace(/[_\-\s]+/g, " ") // normalize delimiters jadi spasi
    .toLowerCase()
    .replace(/ (.)/g, (_, char) => char.toUpperCase()); // kapitalisasi kata ke-2 dst
}
