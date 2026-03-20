import { createAuthClient } from "@neondatabase/auth";

export const authClient = createAuthClient("https://ep-polished-rice-ajlklfzx.neonauth.c-3.us-east-2.aws.neon.tech/neondb/auth", {
  fetchOptions: {
    credentials: "include"
  }
});
