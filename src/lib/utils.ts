import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

export function splitFlags(flags: string) {
  return flags.split(/\s+/).filter((f) => f.length > 0);
}

export async function copyToClipboard(text: string, setCopied: (value: boolean) => void) {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RestProps = Record<string, any>;
