import NextAuth, { NextAuthOptions, Account, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";
import { JWT } from "next-auth/jwt";

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) {
          throw new Error("pas de credentials fournis");
        }

        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return user as NextAuthUser;
          }
          throw new Error("email ou mot de passe incorrect");
        } catch (err: unknown) {
          if (err instanceof Error) {
            throw new Error(err.message);
          }
          throw new Error("erreur inconnue");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: NextAuthUser; account: Account | null }) {
      // Allow sign-in with credentials provider
      return account?.provider === "credentials" ? true : false;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Attach user information to the session
      if (token) {
        session.user = token.user as NextAuthUser;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  debug: true, // Enable debug mode for detailed logs
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
