import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      console.log("Checking token:", token); // Debugging

      if (!token) {
        console.log("no token")
        router.replace("/login");
        return;
      }

      try {
        const payload: any = jwt.decode(token);
        if (!payload?.exp || payload.exp < Date.now() / 1000) {
          console.log("expired")
          localStorage.removeItem("access_token");
          router.replace("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
  
        console.error("Authentication error:", error);
        localStorage.removeItem("access_token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]); // Add router as a dependency

  return { loading, isAuthenticated };
}
