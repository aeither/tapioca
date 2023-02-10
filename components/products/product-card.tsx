import Balancer from "react-wrap-balancer";
import { useEditProductModal } from "./edit-product-modal";

export default function ProductCard({
  productId,
  title,
  description,
  price,
  imageUrl,
}: {
  productId: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}) {
  const { Modal, setShowModal } = useEditProductModal({
    props: { productId: productId },
  });

  return (
    <div
      className={
        "group relative col-span-1 flex h-36 flex-col justify-start overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-md"
      }
    >
      <Modal />
      <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-lg font-bold text-transparent md:text-2xl md:font-normal">
        <Balancer>{title}</Balancer>
      </h2>
      <div className="prose-sm -mt-2 leading-normal text-gray-500 md:prose">
        {description}
      </div>
      <div className="text-lg font-bold">{price}</div>
      <div
        onClick={() => setShowModal(true)}
        className="absolute top-0 right-0 cursor-pointer py-4 px-6 transition md:opacity-0 md:group-hover:opacity-100"
      >
        Edit
      </div>
    </div>
  );
}
