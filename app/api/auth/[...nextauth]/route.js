import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/dbConnect';
import Admin from '../../../../models/Admin';

export const dynamic = 'force-dynamic';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const admin = await Admin.findOne({ email: credentials.email });
        if (!admin) return null;

        const isValid = await bcrypt.compare(credentials.password, admin.password);
        if (!isValid) return null;

        return { id: admin._id.toString(), email: admin.email, name: admin.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
