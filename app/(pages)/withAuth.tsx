import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSecureJsonValueFromLocalStorage, clearSecureLocalStorage } from "../Services/core.services";
import { DeleteAllCookies, GetUIcookie } from "../utils/utils";

const withAuth = (WrappedComponent:any) => {
  const AuthComponent = (props:any) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const aToken = isClient
      ? getSecureJsonValueFromLocalStorage("aToken")
      : null;
    const isAuthenticated = isClient ? checkAuthentication() : false;

    useEffect(() => {
      setIsClient(true); // This will re-trigger rendering once client-side
    }, []);

    useEffect(() => {
      if (isClient && (!isAuthenticated || !aToken)) {
        clearSecureLocalStorage();
        DeleteAllCookies();
        router.push("/");
      }
    }, [isClient, isAuthenticated, aToken, router]);

    if (!isClient || !isAuthenticated || !aToken) {
      return null; // Render nothing or a spinner while waiting for auth check
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};
const checkAuthentication = () => {
  let isAuthenticated = GetUIcookie("isAuthenticated"); // We need to check this once loaded.

  console.log("on the server", isAuthenticated);
  const checkAuth = isAuthenticated === "true";

  return checkAuth;
};

export default withAuth;
