import { AnanasConfig } from "@/components/home/wallet";
import { ClientOnly } from "@/components/layout/client-only";
import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import localFont from "@next/font/local";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Provider as RWBProvider } from "react-wrap-balancer";
import Script from "next/script";

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <RWBProvider>
        <div className={cx(sfPro.variable, inter.variable)}>
          <AnanasConfig network="devnet">
            <ClientOnly>
              <Script src="https://terminal.jup.ag/main.js" />
              <Toaster />

              <Component {...pageProps} />
            </ClientOnly>
          </AnanasConfig>
        </div>
      </RWBProvider>
      <Analytics />
    </SessionProvider>
  );
}
