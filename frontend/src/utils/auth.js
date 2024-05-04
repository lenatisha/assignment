export const API_URL = "http://localhost:3000";

export const AuthProvider = {
  isAuthenticated: false,
  user: null,
  async signIn({ email, password }) {
    const res = await fetch(API_URL + "/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { error: "Invalid credentials" };
    }

    const user = await res.json();

    AuthProvider.isAuthenticated = true;
    AuthProvider.user = user;
  },
  async signOut() {
    await fetch(API_URL + "/logout", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json);
    AuthProvider.isAuthenticated = false;
    AuthProvider.user = null;
  },
};
