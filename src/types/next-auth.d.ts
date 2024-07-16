import NextAuth, { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
    type UserSession = DefaultSession['user'];
    // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    interface Session {
        // A JWT which can be used as Authorization header with supabase-js for RLS.
        supabaseAccessToken?: string;
        user: {
            user: UserSession;
        };
    }

    interface CredentialsInputs {
        email: string;
        password: string;
    }
}
