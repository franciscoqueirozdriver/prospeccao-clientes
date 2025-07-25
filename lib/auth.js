export const authOptions = {
  providers: [], // TODO: configure Azure AD provider
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    }
  }
};
