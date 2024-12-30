import { NextAuthOptions, User, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { compare } from "bcrypt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gerekli")
        }

        try {
          const client = await clientPromise
          const db = client.db()
          const user = await db
            .collection("users")
            .findOne({ email: credentials.email })

          if (!user) {
            throw new Error("Kullanıcı bulunamadı")
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Geçersiz şifre")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username || user.firstName + " " + user.lastName,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
}

