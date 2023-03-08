import { useNewProductModal } from "@/components/checkout/new-product-modal";
import Layout from "@/components/layout";
import ProductCard from "@/components/products/product-card";
import { fetcher } from "@/lib/utils";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Balancer from "react-wrap-balancer";
import useSWR from "swr";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button } from "@mui/material";

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
    <>
      <Grid container spacing={3}>
        <Grid xs="auto">
          <div>
            Side menu
            <Button variant="contained">Button</Button>
          </div>
        </Grid>
        <Grid xs={6}>
          <Button>From Li</Button>
        </Grid>
      </Grid>
    </>
  );
}
