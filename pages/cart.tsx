import Cart from "@/components/home/checkout";
import { ConnectWallet } from "@/components/home/wallet";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";

export default function Home() {
  return (
    <Layout>
      <motion.h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
        <Balancer>Building blocks for your Next project</Balancer>
      </motion.h1>

      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        <div className={""}>
          <ConnectWallet />
          <p>content</p>
          <Cart />
        </div>
      </div>
    </Layout>
  );
}
