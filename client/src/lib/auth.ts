import { z } from "zod";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const validatedFields = CredentialsSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new Error("Invalid email or password");
        }

        const { email, password } = validatedFields.data;
        const query = await db.select().from(users).where(eq(users.email, email));
        const user = query[0];

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          throw new Error("Invalid credentials");
        }

        return { id: String(user.id), name: user.name, email: user.email }; // Convert id to string
      }
      ,
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id ?? "";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
