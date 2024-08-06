import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const pad = (val: number) => (val > 9 ? val : "0" + val); // eslint-disable-line prefer-template
