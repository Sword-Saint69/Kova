import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    baseURL: "https://ep-polished-rice-ajlklfzx.neonauth.c-3.us-east-2.aws.neon.tech/neondb/auth"
});
