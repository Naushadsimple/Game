import './globals.css';

export const metadata = {
  title: 'Vyapar — Classic Indian Property Trading Board Game',
  description: 'A complete, fully playable digital property trading board game inspired by Indian Vyapar. Built with Next.js, React, Tailwind CSS, Framer Motion, and Zustand.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-vyapar-softgrey text-vyapar-navy antialiased selection:bg-vyapar-yellow selection:text-vyapar-navy">
        {children}
      </body>
    </html>
  );
}
