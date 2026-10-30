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
          username: user.username || user.slug,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
          primaryColor: user.primaryColor,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          const existing = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
          });

          if (!existing) {
            const baseSlug = (user.name || user.email.split("@")[0])
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "_")
              .slice(0, 30);

            let uniqueSlug = baseSlug || "user";
            let count = 1;
            while (
              (await prisma.user.findUnique({ where: { slug: uniqueSlug } })) ||
              (await prisma.user.findUnique({ where: { username: uniqueSlug } }))
            ) {
              uniqueSlug = `${baseSlug}_${count++}`;
            }

            const created = await prisma.user.create({
              data: {
                email: user.email.toLowerCase(),
                name: user.name || user.email.split("@")[0],
                googleId: account.providerAccountId,
                slug: uniqueSlug,
                username: uniqueSlug,
                avatar: user.image,
                role: "USER",
                subscriptionStatus: "ACTIVE",
                subscriptionPlan: "STANDARD",
                primaryColor: "#0f766e",
              },
            });

            // Automatically associate the 5 default products
            const defaultProducts = await prisma.product.findMany({
              where: { userId: null, isVisible: true },
              orderBy: { createdAt: "asc" },
              take: 5,
            });

            if (defaultProducts.length > 0) {
              await Promise.all(
                defaultProducts.map((p) =>
                  prisma.product.create({
                    data: {
                      userId: created.id,
                      name: p.name,
                      description: p.description,
                      defaultPrice: p.defaultPrice,
                      originalPrice: p.originalPrice,
                      images: p.images,
                      category: p.category,
                      isVisible: true,
                    },
                  })
                )
              );
            }

            user.id = created.id.toString();
            (user as any).slug = created.slug;
            (user as any).username = created.username;
            (user as any).role = created.role;
            (user as any).subscriptionStatus = created.subscriptionStatus;
            (user as any).subscriptionPlan = created.subscriptionPlan;
            (user as any).primaryColor = created.primaryColor;
          } else {
            user.id = existing.id.toString();
            (user as any).slug = existing.slug;
            (user as any).username = existing.username || existing.slug;
            (user as any).role = existing.role;
            (user as any).subscriptionStatus = existing.subscriptionStatus;
            (user as any).subscriptionPlan = existing.subscriptionPlan;
            (user as any).primaryColor = existing.primaryColor;
          }
        } catch (error) {
          console.error("Error during Google OAuth sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.slug = (user as any).slug;
        token.username = (user as any).username;
        token.subscriptionStatus = (user as any).subscriptionStatus;
        token.subscriptionPlan = (user as any).subscriptionPlan;
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
        (session.user as any).username = token.username;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
        (session.user as any).subscriptionPlan = token.subscriptionPlan;
        (session.user as any).primaryColor = token.primaryColor;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
