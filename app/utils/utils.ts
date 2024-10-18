import { getCookie } from "cookies-next";

interface FlattenedObject {
  [key: string]: any;
}

export const isRunningInServer = typeof window === "undefined";

// Client only
// GetUICookie - reading cookie on the client side is a little tricky
// This is a function that makes it easy.
// Simple pass the cookie variable eg. GetUIcookie("isAuthenticated")
export const GetUIcookie = (cname: string = ""): string => {
  if (isRunningInServer) return "";
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

// Client only
// Define a function to set a UI cookie
// Call the function to set a UI cookie setUICookie("myCookie", "cookieValue", 7);
// Set a cookie named "myCookie" with value "cookieValue" that expires in 7 days
// Extend this to set domain as well for now path=/ is fine.
export const SetUICookie = (name: string, value: string, days: number) => {
  if (isRunningInServer) return "";
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const DeleteAllCookies = () => {
  if (isRunningInServer) return;
  const date = new Date(); 
  const expires = `;expires=${date.toUTCString()}`;
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + "=" + expires + "; path=/";
  }
};




const getServerCookie = (cookieName: string) => {
  return getCookie(cookieName);
};

export const formatDate = (dateString: any) => {
  const dateObj = new Date(dateString);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = dateObj.getUTCMonth();
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
  return formattedDate;
};

export function convertJsonToCsv(jsonData: any, delimiter = ",") {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    console.error("Invalid JSON data provided.");
    return "";
  }

  const keys = Object.keys(jsonData[0]);
  const csvRows = jsonData.map((obj) => {
    return keys.map((key) => {
      const value = obj[key];

      // Handle array values
      if (Array.isArray(value)) {
        return `"${value.join(", ")}"`; // Join array elements into a single string
      }

      // Handle null or undefined values
      if (value === null || value === undefined) {
        return "";
      }

      // Trim leading and trailing whitespace
      const trimmedValue = value.toString().trim();
      // Escape quotes by doubling them
      const escapedValue = trimmedValue.replace(/"/g, "\"\"");
      // Enclose value in quotes if it contains delimiter, newline, or quotes
      return /[,"\n]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
    }).join(delimiter);
  }).join("\n");

  const csvContent = keys.join(delimiter) + "\n" + csvRows;

  // Create a Blob object with the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  return blob;
}