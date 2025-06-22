export function stringToDate(
  dateString: string | null | undefined
): Date | null | undefined {
  return typeof dateString !== "undefined"
    ? dateString !== null
      ? new Date(dateString)
      : null
    : undefined;
}
