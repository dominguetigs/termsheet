export function parsePrice(value: string): number {
  if (!value) {
    return 0;
  }

  return +value.replace(/[^0-9.-]+/g, '');
}
