import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Geometry°",
    template: "%s · Geometry°",
  },
  description: "Explore geometry across culture and science, then build and save interactive spatial structures in the Geometry studio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
