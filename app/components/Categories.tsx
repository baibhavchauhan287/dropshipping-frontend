export default function Categories() {
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Fitness",
    "Beauty",
  ];

  return (
    <section className="max-w-7xl mx-auto py-14 px-6">

      <h2 className="text-3xl font-bold mb-8">
        Shop by Category
      </h2>

      <div className="grid grid-cols-5 gap-6">

        {categories.map((cat) => (
          <div
            key={cat}
            className="bg-white border rounded-xl p-6 text-center hover:shadow-lg cursor-pointer"
          >
            {cat}
          </div>
        ))}

      </div>

    </section>
  );
}