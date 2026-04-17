import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

import { resolvedAuthSecret } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/auth/validation";
import { hasDatabaseUrl, isPrismaRuntimeError, logServerFailure } from "@/lib/services/runtime-safety";

const databaseBackedAuthEnabled = hasDatabaseUrl();

export const authOptions: NextAuthOptions = {
  adapter: databaseBackedAuthEnabled ? PrismaAdapter(prisma) : undefined,
  secret: resolvedAuthSecret,
  session: {
    strategy: databaseBackedAuthEnabled ? "database" : "jwt",
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
        if (!databaseBackedAuthEnabled) {
          return null;
        }

        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const email = parsed.data.email.toLowerCase();
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user?.password) {
            return null;
          }

          const isValidPassword = await verifyPassword(parsed.data.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name ?? user.email ?? "Dialed member",
            email: user.email ?? email
          };
        } catch (error) {
          if (isPrismaRuntimeError(error)) {
            logServerFailure("auth.authorize", error);
            return null;
          }

          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.sub = user.id as string;

        if (typeof user.name === "string") {
          token.name = user.name;
        }

        if (typeof user.email === "string") {
          token.email = user.email;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        const resolvedUserId =
          typeof user?.id === "string"
            ? user.id
            : typeof token.id === "string"
              ? token.id
              : typeof token.sub === "string"
                ? token.sub
                : undefined;

        if (resolvedUserId) {
          session.user.id = resolvedUserId;
        }

        const resolvedName =
          typeof user?.name === "string"
            ? user.name
            : typeof token.name === "string"
              ? token.name
              : undefined;

        if (resolvedName) {
          session.user.name = resolvedName;
        }

        const resolvedEmail =
          typeof user?.email === "string"
            ? user.email
            : typeof token.email === "string"
              ? token.email
              : undefined;

        if (resolvedEmail) {
          session.user.email = resolvedEmail;
        }
      }

      return session;
    }
  }
};
