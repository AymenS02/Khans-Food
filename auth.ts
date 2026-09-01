import { Types } from "mongoose";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import User from "@/models/User";

import { connectToDatabase } from "@/lib/mongodb";

import { loginSchema } from "@/validators/auth.validator";

import { verifyPassword } from "@/services/password.service";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  /*
   * ==========================================
   * SESSION
   * ==========================================
   */

  session: {
    strategy: "jwt",
  },

  /*
   * ==========================================
   * PROVIDERS
   * ==========================================
   */

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

      async authorize(
        credentials
      ) {
        /*
         * ======================================
         * 1. VALIDATE LOGIN INPUT
         * ======================================
         */

        const result =
          loginSchema.safeParse(
            credentials
          );

        if (!result.success) {
          return null;
        }

        const {
          email,
          password,
        } = result.data;

        /*
         * ======================================
         * 2. DATABASE
         * ======================================
         */

        await connectToDatabase();

        /*
         * ======================================
         * 3. FIND USER
         * ======================================
         */

        const user =
          await User.findOne({
            email:
              email
                .trim()
                .toLowerCase(),
          }).select(
            "+password"
          );

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        /*
         * ======================================
         * 4. BLOCK DEACTIVATED CUSTOMERS
         * ======================================
         *
         * This prevents a deactivated customer
         * from starting a NEW session.
         */

        if (
          user.role ===
            "customer" &&
          user.isActive ===
            false
        ) {
          return null;
        }

        /*
         * ======================================
         * 5. VERIFY PASSWORD
         * ======================================
         */

        const passwordIsValid =
          await verifyPassword(
            password,
            user.password
          );

        if (!passwordIsValid) {
          return null;
        }

        /*
         * ======================================
         * 6. AUTHENTICATED USER
         * ======================================
         */

        return {
          id:
            user._id.toString(),

          email:
            user.email,

          name:
            `${user.firstName} ${user.lastName}`,

          role:
            user.role,
        };
      },
    }),
  ],

  /*
   * ==========================================
   * CALLBACKS
   * ==========================================
   */

  callbacks: {
    /*
     * ======================================
     * JWT
     * ======================================
     *
     * This callback runs when the JWT is
     * created and whenever the session is
     * subsequently checked.
     *
     * That lets us compare the JWT against
     * the CURRENT MongoDB user state.
     */

    async jwt({
      token,
      user,
    }) {
      /*
       * Initial login.
       *
       * Copy our custom user fields into
       * the token.
       */

      if (user) {
        token.id =
          user.id;

        token.role =
          user.role;
      }

      /*
       * ======================================
       * IMMEDIATE CUSTOMER REVOCATION
       * ======================================
       *
       * Never trust the old JWT alone.
       *
       * If this is a customer session,
       * check MongoDB to make sure that
       * customer still exists and is active.
       */

      if (
        token.role ===
        "customer"
      ) {
        const userId =
          token.id;

        /*
         * A malformed JWT should not
         * authenticate anyone.
         */

        if (
          typeof userId !==
            "string" ||
          !Types.ObjectId.isValid(
            userId
          )
        ) {
          return null;
        }

        await connectToDatabase();

        const currentUser =
          await User.findOne({
            _id:
              userId,

            role:
              "customer",
          })
            .select(
              "isActive"
            )
            .lean();

        /*
         * Returning null invalidates this
         * JWT session.
         *
         * This handles:
         *
         * - deactivated customer
         * - deleted customer
         * - account no longer being customer
         */

        if (
          !currentUser ||
          currentUser.isActive ===
            false
        ) {
          return null;
        }
      }

      return token;
    },

    /*
     * ======================================
     * SESSION
     * ======================================
     */

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.role =
          token.role as
            | "customer"
            | "admin";
      }

      return session;
    },
  },
});