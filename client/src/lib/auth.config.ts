import { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { db } from "@/db/db";
import { schema } from "@/db/schema";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user by email
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, credentials.email),
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare password with hashed password in DB
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        // Return user object to be stored in JWT token
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.img ?? undefined,
          userType: user.userType,
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // When user signs in with credentials or OAuth
        let dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, user.email),
        });

        if (!dbUser && account) {
          await db.insert(schema.users).values({
            name: user.name || "Anonymous",
            email: user.email,
            password: "",
          });

          // Fetch the newly inserted user
          dbUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, user.email),
          });
        }

        if (dbUser) {
          // Map user data into the JWT token
          token.id = dbUser.id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.userType = dbUser.userType;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Attach the JWT token's data to the session object
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.userType = token.userType as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt" as SessionStrategy,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/signin",  // Custom sign-in page
    error: "/error",    // Custom error page
  },
};