import { useNewProductModal } from "@/components/checkout/new-product-modal";
import Layout from "@/components/layout";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/utils";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Balancer from "react-wrap-balancer";
import useSWR from "swr";

export default function Products() {
  const { query } = useRouter();
  const { shop } = query;
  const _shop = shop || "DEMO_SHOP";

  const { data: products, isLoading } = useSWR<Product[]>(
    `/api/product`,
    fetcher,
  );
  const { Modal: NewProductModal, setShowModal: setShowNewProductModal } =
    useNewProductModal({
      props: {
        address: typeof _shop === "string" ? _shop : _shop[0],
      },
    });

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

      {isLoading && (
        <>
          <div className="mx-auto mt-20 h-24 w-60">
            <div className="flex h-full animate-pulse flex-row items-center justify-center space-x-5">
              <div className="animate-spin text-slate-700">
                <Loader2 size={48} />
              </div>
            </div>
          </div>
        </>
      )}
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
