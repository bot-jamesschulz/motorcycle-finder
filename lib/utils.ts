import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function milesToMeters(miles: string): string {
  const defaultMiles = 50;
  return Math.round(1609.344 * (Number(miles) || defaultMiles)).toString()
}
