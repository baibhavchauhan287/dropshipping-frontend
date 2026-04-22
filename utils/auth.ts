import { jwtDecode } from "jwt-decode";

export function getUser() {

  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  try {

    const decoded: any = jwtDecode(token);

    return {
      email: decoded.sub,
      role: decoded.role, // ADMIN / SUPPLIER / CUSTOMER
    };

  } catch {
    return null;
  }
}