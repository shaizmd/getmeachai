import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "Get Me A Chai",
  description: "A crowd funding platform for your ideas",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  // Add resource hints to optimize loading
  other: {
    'X-UA-Compatible': 'IE=edge',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <SessionWrapper>
        <Navbar />
        <div className="flex-grow min-h-screen">{children}
        </div>
        <Footer/>
        </SessionWrapper>
      </body>
    </html>
  );
}
