
import localFont from "next/font/local";
import "./globals.css";
import BalancedScrollbar from "@/components/layout/BalancedScrollbar";
const gabarito = localFont({
  src: "./fonts/Gabarito.ttf",
  weight: "400 900",
  variable: "--font-gabarito",
  display: "swap",
});

export const metadata = {
  title: "Yours, Hammad | Creative Developer",
  description:
    "A portfolio of creative development, thoughtful design, and digital experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={gabarito.variable}>
        {children}
        <BalancedScrollbar />
      </body>
    </html>
  );
}
