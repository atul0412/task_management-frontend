import { v4 as uuidv4 } from "uuid";
const ISSERVER = typeof window === "undefined";

export const setSecureJsonValueInLocalStorage = (key: string, value: any) => {
  const tempValue = typeof value === "object" ? JSON.stringify(value) : value;
  localStorage.setItem(key, tempValue);
};

export const getSecureJsonValueFromLocalStorage = (key: string) => {
  if (!ISSERVER) {
    let data: any = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }
};

export const clearSecureLocalStorage = () => {
  localStorage.clear();
};

export const removeSecureJsonValueFromLocalStorage = (key: string) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      return "Key not found in localStorage.";
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUid = () => {
  let uuid = uuidv4();
  return uuid;
};