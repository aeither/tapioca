import Balancer from "react-wrap-balancer";

export default function ProductCard({
  title,
  description,
  large,
}: {
  title: string;
  description: string;
  large?: boolean;
}) {
  return (
    <div
      className={
        "relative col-span-1 flex h-36 flex-col justify-start overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-md"
      }
    >
      <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-lg font-bold text-transparent md:text-2xl md:font-normal">
        <Balancer>{title}</Balancer>
      </h2>
      <div className="prose-sm -mt-2 leading-normal text-gray-500 md:prose">
        {description}
      </div>
    </div>
  );
}
