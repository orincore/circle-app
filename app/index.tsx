import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getAuthData } from "./utils/auth";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const { token } = await getAuthData();
        if (token) {
          router.replace("/dashboard");
        } else {
          router.replace("/welcome");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        router.replace("/welcome");
      }
    }

    checkAuthStatus();
  }, []);

  return null; // This ensures nothing is displayed while navigating
}
