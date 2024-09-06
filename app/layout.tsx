import Providers from "@/providers/providers";
import { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Shopify App",
  other: {
    "shopify-api-key": process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || "",
    "shopify-app-origins": process.env.NEXT_PUBLIC_HOST || "",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="test" content="test" />
        <Script
          src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
