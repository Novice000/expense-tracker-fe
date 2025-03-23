import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!router.isReady) return; // Wait for router to be ready
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload: any = jwt.decode(token);
      if (!payload || !payload.exp) {
        throw new Error("Invalid token");
      }
      if (payload.exp < Date.now() / 1000) {
        localStorage.removeItem("access_token");
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      localStorage.removeItem("access_token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router.isReady]);

  return { loading, isAuthenticated };
}
