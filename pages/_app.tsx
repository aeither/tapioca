import { AnanasConfig } from "@/components/home/wallet";
import { ClientOnly } from "@/components/layout/client-only";
import "@/styles/globals.css";
import { theme } from "@/styles/theme";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material/styles";
import { Inter } from "@next/font/google";
import localFont from "@next/font/local";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { Provider as RWBProvider } from "react-wrap-balancer";
import { api } from "@/lib/api";

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default api.withTRPC(MyApp);
