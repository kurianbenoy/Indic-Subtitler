import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  let localstorage = typeof window !== "undefined" ? localStorage : null;
  const [value, setValue] = useState(() => {
    const jsonValue = localstorage?.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
