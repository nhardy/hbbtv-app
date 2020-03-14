export function fromHex(s: string): number {
  return parseInt(s, 16);
}

export function toHex(n: number): string {
  return n.toString(16);
}

export function zfill (s: number | string, length: number): string {
  return `${s}`.padStart(length, '0');
}
