import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    title: "Wireless Mouse",
    price: 25,
    image: "https://picsum.photos/300",
  },
  {
    id: 2,
    title: "Gaming Keyboard",
    price: 70,
    image: "https://picsum.photos/301",
  },
  {
    id: 3,
    title: "Smart Watch",
    price: 120,
    image: "https://picsum.photos/302",
  },
  {
    id: 4,
    title: "Bluetooth Speaker",
    price: 60,
    image: "https://picsum.photos/303",
  },
];

export default function ProductGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <h2 className="text-3xl font-bold mb-8">
        Trending Products
      </h2>

      <div className="grid md:grid-cols-4 gap-8">

        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}

      </div>

    </section>
  );
}