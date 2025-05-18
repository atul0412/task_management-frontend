import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSecureJsonValueFromLocalStorage, clearSecureLocalStorage } from "../Services/core.services";
import { DeleteAllCookies, GetUIcookie } from "../utils/utils";

const Spinner = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw"
  }}>
    <div style={{
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3498db",
      borderRadius: "50%",
      width: 40,
      height: 40,
      animation: "spin 1s linear infinite"
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
  </div>
);

const withAuth = (WrappedComponent: any) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [aToken, setAToken] = useState<string | null>(null);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (isClient) {
        const token = getSecureJsonValueFromLocalStorage("aToken");
        const auth = checkAuthentication();
        setAToken(token);
        setIsAuthenticated(auth);
        setLoading(false);

        if (!auth || !token) {
          clearSecureLocalStorage();
          DeleteAllCookies();
          router.push("/");
        }
      }
    }, [isClient, router]);

    if (loading) {
      return <Spinner />;
    }

    if (!isAuthenticated || !aToken) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

const checkAuthentication = () => {
  let isAuthenticated = GetUIcookie("isAuthenticated");
  return isAuthenticated === "true";
};

export default withAuth;
