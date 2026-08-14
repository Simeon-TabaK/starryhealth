import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email ou Nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Veuillez fournir un identifiant et un mot de passe.");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier.toLowerCase() },
              { username: credentials.identifier.toLowerCase() },
              { slug: credentials.identifier.toLowerCase() },
            ],
          },
        });

        if (!user || !user.password) {
          throw new Error("Identifiants de connexion invalides.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Mot de passe incorrect.");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          slug: user.slug,
          subscriptionStatus: user.subscriptionStatus,
          primaryColor: user.primaryColor,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.slug = (user as any).slug;
        token.subscriptionStatus = (user as any).subscriptionStatus;
        token.primaryColor = (user as any).primaryColor;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).slug = token.slug;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
        (session.user as any).primaryColor = token.primaryColor;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "starryhealth_secret_key_123456789",
};
