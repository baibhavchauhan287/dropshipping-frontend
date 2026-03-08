import Link from "next/link";

interface Props {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
}: Props) {

  return (
    <Link href={`/products/${id}`}>

      <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg">

        <img src={image} className="w-full h-48 object-cover" />

        <div className="p-4">

          <h3 className="font-semibold">{title}</h3>

          <p className="text-gray-600 mt-2">${price}</p>

        </div>

      </div>

    </Link>
  );
}