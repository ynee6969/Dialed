import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { resolvedAuthSecret } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/auth/validation";
import { hasDatabaseUrl } from "@/lib/services/runtime-safety";

export const authOptions: NextAuthOptions = {
  secret: resolvedAuthSecret,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: {
          label: "Email",
          type: "email"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(rawCredentials) {
        if (!hasDatabaseUrl()) {
          return null;
        }

        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await verifyPassword(parsed.data.password, user.password);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.sub = user.id as string;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }

      if (session.user && typeof token.name === "string") {
        session.user.name = token.name;
      }

      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
      }

      return session;
    }
  }
};
