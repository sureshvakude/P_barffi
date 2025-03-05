import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      userType: string;
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    userType: string; // 👈 Add custom field
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    userType: string;
  }
}