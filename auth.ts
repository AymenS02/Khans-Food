import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { loginSchema } from "@/validators/auth.validator";
import { verifyPassword } from "@/services/password.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;

        await connectToDatabase();

        const user = await User.findOne({
          email: email.toLowerCase(),
        }).select("+password");

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        if (!user.isActive) {
          return null;
        }
        console.log(password, user.password);
        const passwordIsValid = await verifyPassword(
          password,
          user.password
        );

        if (!passwordIsValid) {
          return null;
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "customer" | "admin";
      }

      return session;
    },
  },
});