import './globals.css';

export const metadata = {
  title: 'Paripakv Admin',
  description: 'Admin dashboard for Paripakv Foundation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
