import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex items-center justify-center h-screen text-gray-800">
        <div className="text-center px-6">
          <h1 className="text-[4rem] lg:text-[8rem] font-extrabold text-gray-900 mb-2 leading-none">404</h1>
          <h2 className="text-2xl font-semibold mb-3">Oops! Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </body>
    </html>
  );
}
