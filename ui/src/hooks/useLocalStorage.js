import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  let localstorage = typeof window !== "undefined" ? localStorage : null;
  const [value, setValue] = useState(() => {
    const jsonValue = localstorage?.getItem(key);
    if (jsonValue == null) return initialValue;
    try {
      return JSON.parse(jsonValue);
    } catch (error) {
      // A corrupt value must not crash the page during the first render. The
      // effect below writes the reset value back, so the bad data is replaced.
      console.error(`Ignoring unreadable localStorage key "${key}"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Quota errors must not crash the page that is using the hook.
      console.error(`Could not persist localStorage key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
