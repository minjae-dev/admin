import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (email === 'admin@test.com' && password === '123456') {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@test.com',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});
