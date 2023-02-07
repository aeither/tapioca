import Card from "@/components/home/card";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { DEPLOY_URL, FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { ConnectWallet } from "@/components/home/wallet";
import Products from "@/components/home/products";
import { addLink } from "@/lib/api/links";
import { mutate } from "swr";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";
import Link from "next/link";

interface FormInput {
  title: string;
  description: string;
  amount: string;
}

export default function Home() {
  const { data: links } = useSWR<Prisma.LinkSelect[]>(`/api/links`, fetcher);
  const { register, handleSubmit } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const { amount, description, title } = data;

    fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        amount: parseFloat(amount),
      }),
    }).then((res) => {
      console.log(res), mutate("/api/links");
    });
  };

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
          <Products submitTarget="/cart" enabled />
        </div>
        <div className={""}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>link to db</h3>
            <input defaultValue="brownie" {...register("title")} />
            <input
              defaultValue="a chocolate brownie"
              {...register("description")}
            />
            <input
              type="number"
              defaultValue={0.01}
              step={0.01}
              {...register("amount")}
            />
            <button type="submit" className="rounded bg-slate-300 p-4">
              Create Link
            </button>
          </form>
          {links &&
            links.map((link, i) => (
              <div key={i} className="flex gap-4">
                <p>Amount: {link.amount}</p>
                <p>Reference: {link.reference}</p>
                <p>Status: {link.status}</p>
                <Link href={`/link/${link.reference}`}>Open</Link>
              </div>
            ))}
        </div>
        {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={
              title === "Beautiful, reusable components" ? (
                <ComponentGrid />
              ) : (
                demo
              )
            }
            large={large}
          />
        ))}
      </div>
    </Layout>
  );
}

const features = [
  {
    title: "Beautiful, reusable components",
    description:
      "Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Framer Motion](https://framer.com/motion)",
    large: true,
  },
  {
    title: "Performance first",
    description:
      "Built on [Next.js](https://nextjs.org/) primitives like `@next/font` and `next/image` for stellar performance.",
    demo: <WebVitals />,
  },
  {
    title: "One-click Deploy",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <a href={DEPLOY_URL}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://vercel.com/button"
          alt="Deploy with Vercel"
          width={120}
        />
      </a>
    ),
  },
  {
    title: "Built-in Auth + Database",
    description:
      "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <Image alt="Auth.js logo" src="/authjs.webp" width={50} height={50} />
        <Image alt="Prisma logo" src="/prisma.svg" width={50} height={50} />
      </div>
    ),
  },
  {
    title: "Hooks, utilities, and more",
    description:
      "Precedent offers a collection of hooks, utilities, and `@vercel/og`",
    demo: (
      <div className="grid grid-flow-col grid-rows-3 gap-10 p-10">
        <span className="font-mono font-semibold">useIntersectionObserver</span>
        <span className="font-mono font-semibold">useLocalStorage</span>
        <span className="font-mono font-semibold">useScroll</span>
        <span className="font-mono font-semibold">nFormatter</span>
        <span className="font-mono font-semibold">capitalize</span>
        <span className="font-mono font-semibold">truncate</span>
      </div>
    ),
  },
];
