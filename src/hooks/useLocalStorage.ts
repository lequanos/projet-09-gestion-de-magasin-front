import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T | null = null,
  errCallback?: (error: unknown) => void,
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      if (errCallback) errCallback(error);

      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      if (errCallback) errCallback(error);
    }
  };
  return [storedValue, setValue] as const;
}
