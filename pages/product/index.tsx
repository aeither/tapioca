import { useNewProductModal } from "@/components/checkout/new-product-modal";
import WebVitals from "@/components/home/web-vitals";
import Layout from "@/components/layout";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { DEPLOY_URL } from "@/lib/constants";
import { fetcher } from "@/lib/utils";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import Balancer from "react-wrap-balancer";
import useSWR from "swr";

export default function Products() {
  const { query } = useRouter();
  const { shop } = query;
  const _shop = shop || "";

  const { Modal: NewProductModal, setShowModal: setShowNewProductModal } =
    useNewProductModal({
      props: {
        address: typeof _shop === "string" ? _shop : _shop[0],
      },
    });

  const { data: products } = useSWR<Product[]>(`/api/product`, fetcher);
  return (
    <Layout>
      <NewProductModal />
      <div className="mb-8 flex w-full items-center justify-between">
        <motion.h1 className="font-display text-xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-4xl md:leading-[5rem]">
          <Balancer>Products</Balancer>
        </motion.h1>
        <Button onClick={() => setShowNewProductModal(true)}>
          Add product
        </Button>
      </div>

      <div className="grid  w-full grid-cols-1 gap-4 md:grid-cols-3">
        {products &&
          products.map(({ id, title, description, imageUrl, price }) => (
            <ProductCard
              key={id}
              productId={id}
              title={title}
              description={description}
              price={price}
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
