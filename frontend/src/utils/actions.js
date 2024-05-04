import { redirect } from "react-router-dom";
import { API_URL, AuthProvider } from "./auth";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const userCredential = Object.fromEntries(formData);

  // Validate our form inputs and return validation errors via useActionData()
  if (!userCredential.email || !userCredential.password) {
    return { error: "You must provide a email and password to log in" };
  }
  // Sign in and redirect to the proper destination if successful.
  const res = await AuthProvider.signIn(userCredential);

  if (res?.error) {
    return { error: res.error };
  }
  return redirect("/");
}

export async function registerAction({ request }) {
  const formData = await request.formData();
  const userCredential = Object.fromEntries(formData);

  // Validate our form inputs and return validation errors via useActionData()
  if (!userCredential.email || !userCredential.password) {
    return { error: "You must provide a email and password to register" };
  }

  if (userCredential.password !== userCredential.confirmPassword) {
    return { error: "Passwords do not match" };
  }
  // Sign in and redirect to the proper destination if successful.
  const res = await fetch(API_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userCredential),
  });

  if (!res.ok) {
    return { error: res.status === 409 ? "Username already exists" : "Something went wrong" };
  }
  await AuthProvider.signIn(userCredential);

  return redirect("/");
}

export async function logoutAction() {
  console.log("logging out");
  await AuthProvider.signOut();
  return redirect("/login");
}

export async function uploadAction({ request }) {
  const formData = await request.formData();

  const res = await fetch(API_URL + "/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    return { error: "Something went wrong" };
  }
  return redirect("/", { message: "Image uploaded successfully" });
}

export async function deleteAction({ request }) {
  const formData = await request.formData();
  const res = await fetch(API_URL + formData.get("imageUrl"), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    return { error: "Something went wrong" };
  }

  return redirect("/", { message: "Image deleted successfully" });
}
