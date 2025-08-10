"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getCarById,
  formatPrice,
  formatPriceUSD,
  generateWhatsAppMessage,
} from "@/lib/cars";
import { Car, BookingForm } from "@/types/car";

export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    carId: "",
    preferredDate: "",
    message: "",
  });

  useEffect(() => {
    if (params.id) {
      const foundCar = getCarById(params.id as string);
      setCar(foundCar || null);
      if (foundCar) {
        setBookingForm((prev) => ({ ...prev, carId: foundCar.id }));
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - in real app, this would call an API
    console.log("Booking submitted:", bookingForm);
    alert(
      "Inspection booking submitted! We will contact you soon to confirm the appointment."
    );
    setShowBookingForm(false);
    setBookingForm({
      name: "",
      phone: "",
      email: "",
      carId: car?.id || "",
      preferredDate: "",
      message: "",
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-zinc-300 h-96 rounded-lg mb-8"></div>
          <div className="h-8 bg-zinc-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-zinc-300 rounded w-1/4 mb-8"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="text-zinc-400 text-6xl mb-4">🚗</div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Car Not Found</h1>
        <p className="text-zinc-600 mb-8">
          The car you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/cars"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse All Cars
        </Link>
      </div>
    );
  }

  const whatsappMessage = generateWhatsAppMessage(car);
  const whatsappUrl = `https://wa.me/2349026446912?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-zinc-600">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/cars"
            className="hover:text-orange-600 transition-colors"
          >
            Cars
          </Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium">
            {car.year} {car.brand} {car.model}
          </span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4">
            <Image
              src={car.images[currentImageIndex]}
              alt={`${car.year} ${car.brand} ${car.model}`}
              width={600}
              height={400}
              className="w-full h-96 object-cover rounded-lg"
            />
            {car.newly_arrived && (
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

          {car.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex
                      ? "border-orange-500"
                      : "border-zinc-300 hover:border-zinc-400"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`View ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Car Details */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">
            {car.year} {car.brand} {car.model}
          </h1>

          <div className="flex flex-col gap-2 mb-6">
            <div className="text-3xl font-bold text-orange-600">
              {formatPrice(car.price)}
            </div>
            <div className="text-lg text-zinc-600">
              ({formatPriceUSD(car.priceUSD)})
            </div>
          </div>

          <div className="bg-zinc-50 p-6 rounded-lg mb-6 border border-zinc-200">
            <h3 className="font-semibold text-zinc-900 mb-4">Key Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-600">Year:</span>
                <span className="ml-2 font-medium text-zinc-900">
                  {car.year}
                </span>
              </div>
              <div>
                <span className="text-zinc-600">Mileage:</span>
                <span className="ml-2 font-medium text-zinc-900">
                  {car.mileage.toLocaleString()} km
                </span>
              </div>
              <div>
                <span className="text-zinc-600">Transmission:</span>
                <span className="ml-2 font-medium text-zinc-900">
                  {car.transmission}
                </span>
              </div>
              <div>
                <span className="text-zinc-600">Fuel Type:</span>
                <span className="ml-2 font-medium text-zinc-900">
                  {car.fuel}
                </span>
              </div>
              <div>
                <span className="text-zinc-600">Condition:</span>
                <span className="ml-2 font-medium text-zinc-900">
                  {car.condition}
                </span>
              </div>
              <div>
                <span className="text-zinc-600">Location:</span>
                <span className="ml-2 font-medium text-zinc-900">
                  {car.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              📅 Book Inspection
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              💬 Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Description</h2>
        <p className="text-zinc-700 leading-relaxed">{car.description}</p>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {car.features.map((feature, index) => (
            <div
              key={index}
              className="bg-orange-50 text-orange-800 px-3 py-2 rounded-lg text-sm border border-orange-200"
            >
              ✓ {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-zinc-900 text-xl font-bold">
                Book Inspection
              </h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-zinc-600"
                  value={bookingForm.name}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="booking-phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-zinc-600"
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="booking-email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-zinc-600"
                  value={bookingForm.email}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="booking-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preferred Date *
                </label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-zinc-600"
                  value={bookingForm.preferredDate}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      preferredDate: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="booking-message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="booking-message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-zinc-600"
                  value={bookingForm.message}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, message: e.target.value })
                  }
                  placeholder="Any specific requirements or questions?"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
