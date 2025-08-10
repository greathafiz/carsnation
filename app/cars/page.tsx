"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllCars, formatPrice, formatPriceUSD } from "@/lib/cars";
import { Car, SearchFilters } from "@/types/car";
import { Suspense } from "react";

export default function CarsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsPageContent />
    </Suspense>
  );
}

function CarsPageContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setCars(getAllCars());
  }, []);

  const filteredAndSortedCars = useMemo(() => {
    const filtered = cars.filter((car) => {
      // Search term filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matches =
          car.brand.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search) ||
          car.year.toString().includes(search) ||
          car.location.toLowerCase().includes(search);
        if (!matches) return false;
      }

      // Other filters
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      if (filters.transmission && car.transmission !== filters.transmission)
        return false;
      if (filters.fuel && car.fuel !== filters.fuel) return false;
      if (filters.location && car.location !== filters.location) return false;

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "year-new":
        return filtered.sort((a, b) => b.year - a.year);
      case "year-old":
        return filtered.sort((a, b) => a.year - b.year);
      case "mileage":
        return filtered.sort((a, b) => a.mileage - b.mileage);
      case "newest":
      default:
        return filtered.sort(
          (a, b) =>
            new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
        );
    }
  }, [cars, filters, searchTerm, sortBy]);

  const brands = useMemo(
    () => [...new Set(cars.map((car) => car.brand))].sort(),
    [cars]
  );
  const locations = useMemo(
    () => [...new Set(cars.map((car) => car.location))].sort(),
    [cars]
  );

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-zinc-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">All Cars</h1>
        <p className="text-zinc-600">
          Find your perfect car from our extensive inventory
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Brand, model, year..."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Brand
            </label>
            <select
              aria-label="Filter by brand"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
              value={filters.brand || ""}
              onChange={(e) =>
                setFilters({ ...filters, brand: e.target.value || undefined })
              }
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Location
            </label>
            <select
              aria-label="Filter by location"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
              value={filters.location || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  location: e.target.value || undefined,
                })
              }
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Sort By
            </label>
            <select
              aria-label="Sort cars by"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest First</option>
              <option value="year-old">Year: Oldest First</option>
              <option value="mileage">Lowest Mileage</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Min Price (₦)
            </label>
            <input
              type="number"
              placeholder="e.g., 2000000"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
              value={filters.minPrice || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Max Price (₦)
            </label>
            <input
              type="number"
              placeholder="e.g., 15000000"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({});
                setSearchTerm("");
              }}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-zinc-600">
          {filteredAndSortedCars.length} car
          {filteredAndSortedCars.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredAndSortedCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {filteredAndSortedCars.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-zinc-400 text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">
            No cars found
          </h3>
          <p className="text-zinc-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}

interface CarCardProps {
  car: Car;
}

function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-zinc-200">
      <div className="relative">
        <Image
          src={car.images[0]}
          alt={`${car.year} ${car.brand} ${car.model}`}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
        {car.newly_arrived && (
          <div className="absolute top-3 left-3">
            <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              New
            </span>
          </div>
        )}
        {car.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-zinc-900 mb-2">
          {car.year} {car.brand} {car.model}
        </h3>

        <div className="space-y-1 mb-3 text-sm text-zinc-600">
          <div className="flex justify-between">
            <span>📍 {car.location}</span>
            <span>🚗 {car.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex justify-between">
            <span>⚙️ {car.transmission}</span>
            <span>⛽ {car.fuel}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xl font-bold text-orange-600">
            {formatPrice(car.price)}
          </div>
          <div className="text-sm text-zinc-500">
            ({formatPriceUSD(car.priceUSD)})
          </div>
        </div>

        <Link
          href={`/cars/${car.id}`}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
