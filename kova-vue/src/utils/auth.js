import { createAuthClient } from "@neondatabase/auth/vanilla";

export const authClient = createAuthClient({
  baseURL: window.location.origin + "/api/auth",
  fetchOptions: {
    credentials: "include"
  }
});
