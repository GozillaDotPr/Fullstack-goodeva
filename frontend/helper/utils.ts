import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'


const retry_cooldown = 5000


export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); //millisecond

export const getDataApi = async (url: string) => {
  const max_retry = 3;

  for (let retry = 0; retry < max_retry; retry++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }

      console.warn(`Attempt ${retry + 1}: HTTP ${response.status}`);
    } catch (err) {
      console.warn(`Attempt ${retry + 1}: Network error`, err);
    }

    if (retry < max_retry - 1) {
      await sleep(retry_cooldown);
    }
  }

  throw new Error("Failed to connect external api")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


