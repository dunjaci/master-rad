import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Replikacija genoma",
  description: "Elektronska lekcija",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
