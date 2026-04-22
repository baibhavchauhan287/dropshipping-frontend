export default function Hero() {
  return (
    <section className="bg-indigo-600 text-white">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center p-10 gap-10">

        <div>

          <h1 className="text-5xl font-bold leading-tight">
             Madhubani Arts Connect
          </h1>

          <p className="mt-4 text-lg text-indigo-100">
            Discover trending products from trusted suppliers.
          </p>

          <button className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold">
            Shop Now
          </button>

        </div>

        <img
          src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db"
          className="rounded-xl shadow-lg"
        />

      </div>

    </section>
  );
}