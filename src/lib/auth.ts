import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import jwt from 'jsonwebtoken';
import { Adapter } from 'next-auth/adapters';
import GithubProvider from 'next-auth/providers/github';
import CredentialProvider from 'next-auth/providers/credentials';

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/core/types#authconfig
export const { handlers, auth, signIn, signOut } = NextAuth({
    // https://authjs.dev/getting-started/authentication/oauth
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? ''
        }),
        CredentialProvider({
            credentials: {
                email: {
                    type: 'email'
                },
                password: {
                    type: 'password'
                }
            },
            async authorize(credentials, req) {
                const user = {
                    id: '1',
                    name: 'John',
                    email: credentials?.email as string
                };
                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!
    }) as Adapter,
    callbacks: {
        async session({ session, user }) {
            const signingSecret = process.env.SUPABASE_JWT_SECRET;
            if (signingSecret) {
                const payload = {
                    aud: 'authenticated',
                    exp: Math.floor(new Date(session.expires).getTime() / 1000),
                    sub: user.id,
                    email: user.email,
                    role: 'authenticated'
                };
                session.supabaseAccessToken = jwt.sign(payload, signingSecret);
            }
            return session;
        }
    },
    pages: {
        signIn: '/accounts/login' //sign-in page
    }
});
