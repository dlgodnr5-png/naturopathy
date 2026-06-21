import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
  ],
  pages: {
    // Custom login page or default
    signIn: "/login",
  },
  callbacks: {
    async session({ session }) {
      // Send properties to the client, like an access_token and user id from a provider.
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only",
});

export { handler as GET, handler as POST };
