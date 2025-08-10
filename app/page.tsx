"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  getFeaturedCars,
  getNewlyArrivedCars,
  formatPrice,
  formatPriceUSD,
} from "@/lib/cars";
import { Car } from "@/types/car";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const featuredCars = getFeaturedCars();
  const newlyArrived = getNewlyArrivedCars();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/cars?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Car
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-zinc-300">
              Quality foreign used cars with professional inspection services
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search by brand, model, or year..."
                  className="flex-1 px-6 py-4 text-zinc-900 bg-white rounded-lg text-lg border-2 border-transparent focus:border-orange-500 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 px-8 py-4 rounded-lg font-semibold text-lg text-white transition-colors"
                >
                  Search Cars
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <div className="text-3xl font-bold text-orange-600 mb-2">22</div>
              <div className="text-zinc-600">Inspections This Month</div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                150+
              </div>
              <div className="text-zinc-600">Cars Available</div>
            </div>
            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200">
              <div className="text-3xl font-bold text-zinc-700 mb-2">98%</div>
              <div className="text-zinc-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Featured Cars
            </h2>
            <p className="text-xl text-zinc-600">
              Hand-picked premium vehicles for discerning buyers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredCars.slice(0, 6).map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/cars"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Newly Arrived */}
      {newlyArrived.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Newly Arrived
              </h2>
              <p className="text-xl text-zinc-600">
                Fresh inventory just in from abroad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newlyArrived.slice(0, 4).map((car) => (
                <CarCard key={car.id} car={car} showNewTag={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-zinc-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl mb-8 text-zinc-300">
            Browse our complete inventory, sell your car, or get in touch with
            our experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cars"
              className="bg-white text-zinc-800 hover:bg-zinc-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Cars
            </Link>
            <Link
              href="/sell-your-car"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sell Your Car
            </Link>
            <a
              href="https://wa.me/+2349026446912"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CarCardProps {
  car: Car;
  showNewTag?: boolean;
}

function CarCard({ car, showNewTag = false }: CarCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-zinc-200">
      <div className="relative">
        <Image
          src={car.images[0]}
          alt={`${car.year} ${car.brand} ${car.model}`}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        {showNewTag && car.newly_arrived && (
          <div className="absolute top-4 left-4">
            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Newly Arrived
            </span>
          </div>
        )}
        {car.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-zinc-900 mb-2">
          {car.year} {car.brand} {car.model}
        </h3>

        <div className="space-y-2 mb-4">
          <p className="text-zinc-600">📍 {car.location}</p>
          <p className="text-zinc-600">🚗 {car.mileage.toLocaleString()} km</p>
          <p className="text-zinc-600">⚙️ {car.transmission}</p>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <div className="text-2xl font-bold text-orange-600">
            {formatPrice(car.price)}
          </div>
          <div className="text-sm text-zinc-500">
            ({formatPriceUSD(car.priceUSD)})
          </div>
        </div>

        <Link
          href={`/cars/${car.id}`}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
