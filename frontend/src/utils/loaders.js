import { redirect } from "react-router-dom";
import { API_URL, AuthProvider } from "./auth";

export async function userImageLoader() {
  if (!AuthProvider.isAuthenticated) {
    const res = await fetch(API_URL + "/me", { credentials: "include" });

    if (!res.ok) {
      return redirect("/login");
    }
    const user = await res.json();

    AuthProvider.isAuthenticated = true;
    AuthProvider.user = user;
  }

  const res2 = await fetch(API_URL + "/images", {
    credentials: "include",
  });

  if (!res2.ok) return { error: "Error fetching images" };

  const images = await res2.json();

  console.log(images);

  return { images };
}

export async function loginLoader() {
  if (AuthProvider.isAuthenticated) return redirect("/");

  const res = await fetch(API_URL + "/me", { credentials: "include" });

  if (!res.ok) return null;

  const user = await res.json();
  AuthProvider.isAuthenticated = true;
  AuthProvider.user = user;

  return redirect("/");
}
