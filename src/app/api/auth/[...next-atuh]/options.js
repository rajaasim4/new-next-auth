import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { DbConnection } from "@/DB/DbConnection";
import User from "@/Models/userModal";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "*******",
        },
      },
      async authorize(credentials) {
        await DbConnection();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.idnetifier },
            ],
          });
          if (!user) {
            throw new Error("No User Find");
          }
          if (!user.isVerified) {
            throw new Error("Please Verify Your Account");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Credentials");
          }
        } catch (error) {
          throw new Error(error);
          console.log("An Error Occured ", error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
  },
};
