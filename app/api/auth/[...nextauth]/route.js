import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await dbConnect()
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email })
          if (!user) {
            return null
          }

          // Check if password matches
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            return null
          }

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.email.split('@')[0], // Consistent with email prefix
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
    signUp: '/signup',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle GitHub OAuth sign in
      if (account?.provider === 'github') {
        try {
          await dbConnect()
          
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user for GitHub OAuth
            const newUser = new User({
              email: user.email,
              password: 'oauth_github', // Placeholder password for OAuth users
              name: user.name || user.email.split('@')[0],
              provider: 'github',
              githubId: profile.id
            })
            
            await newUser.save()
            
          }
          
          return true
        } catch (error) {
          console.error('Error saving GitHub user:', error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }