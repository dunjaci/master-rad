import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "OriC elektronska lekcija",
  description: "Pronalaženje početnog regiona replikacije DNK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
