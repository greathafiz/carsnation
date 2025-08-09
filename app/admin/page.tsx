"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getAllCars,
  addCar,
  updateCar,
  deleteCar,
  formatPrice,
  formatPriceUSD,
} from "@/lib/cars";
import { Car } from "@/types/car";

interface CarFormData {
  brand: string;
  model: string;
  year: number | "";
  price: number | "";
  priceUSD: number | "";
  mileage: number | "";
  transmission: string;
  fuel: string;
  condition: string;
  location: string;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  newly_arrived: boolean;
}

const initialFormData: CarFormData = {
  brand: "",
  model: "",
  year: "",
  price: "",
  priceUSD: "",
  mileage: "",
  transmission: "Automatic",
  fuel: "Petrol",
  condition: "Foreign Used",
  location: "Lagos",
  description: "",
  features: [],
  images: [""],
  featured: false,
  newly_arrived: false,
};

export default function AdminPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<CarFormData>(initialFormData);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    setCars(getAllCars());
  }, []);

  const refreshCars = () => {
    setCars(getAllCars());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.brand ||
      !formData.model ||
      !formData.year ||
      !formData.price
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const carData: Car = {
      id: editingCar?.id || Date.now().toString(),
      brand: formData.brand,
      model: formData.model,
      year: Number(formData.year),
      price: Number(formData.price),
      priceUSD: Number(formData.priceUSD),
      mileage: Number(formData.mileage),
      transmission: formData.transmission,
      fuel: formData.fuel,
      condition: formData.condition,
      location: formData.location,
      description: formData.description,
      features: formData.features.filter((f) => f.trim()),
      images: formData.images.filter((img) => img.trim()),
      featured: formData.featured,
      newly_arrived: formData.newly_arrived,
      date_added:
        editingCar?.date_added || new Date().toISOString().split("T")[0],
    };

    if (editingCar) {
      updateCar(carData);
    } else {
      addCar(carData);
    }

    resetForm();
    refreshCars();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingCar(null);
    setShowForm(false);
    setNewFeature("");
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      priceUSD: car.priceUSD,
      mileage: car.mileage,
      transmission: car.transmission,
      fuel: car.fuel,
      condition: car.condition,
      location: car.location,
      description: car.description,
      features: [...car.features],
      images: [...car.images],
      featured: car.featured,
      newly_arrived: car.newly_arrived,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      deleteCar(id);
      refreshCars();
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-zinc-50">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Admin Dashboard
            </h1>
            <p className="text-zinc-600">Manage your car inventory</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            + Add New Car
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
          <div className="text-2xl font-bold text-orange-600">
            {cars.length}
          </div>
          <div className="text-zinc-600">Total Cars</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
          <div className="text-2xl font-bold text-emerald-600">
            {cars.filter((c) => c.featured).length}
          </div>
          <div className="text-zinc-600">Featured</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
          <div className="text-2xl font-bold text-blue-600">
            {cars.filter((c) => c.newly_arrived).length}
          </div>
          <div className="text-zinc-600">Newly Arrived</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
          <div className="text-2xl font-bold text-zinc-700">22</div>
          <div className="text-zinc-600">This Month Bookings</div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Car Inventory</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        src={car.images[0]}
                        alt={`${car.year} ${car.brand} ${car.model}`}
                        width={60}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {car.year} {car.brand} {car.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {car.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{car.mileage.toLocaleString()} km</div>
                    <div className="text-gray-500">
                      {car.transmission} • {car.fuel}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{formatPrice(car.price)}</div>
                    <div className="text-gray-500">
                      {formatPriceUSD(car.priceUSD)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col space-y-1">
                      {car.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                      {car.newly_arrived && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingCar ? "Edit Car" : "Add New Car"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="form-brand"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Brand *
                  </label>
                  <input
                    id="form-brand"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="form-model"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Model *
                  </label>
                  <input
                    id="form-model"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="form-year"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Year *
                  </label>
                  <input
                    id="form-year"
                    type="number"
                    required
                    min="1990"
                    max="2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: e.target.value ? Number(e.target.value) : "",
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="form-mileage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mileage (km) *
                  </label>
                  <input
                    id="form-mileage"
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mileage: e.target.value ? Number(e.target.value) : "",
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="form-price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price (₦) *
                  </label>
                  <input
                    id="form-price"
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value ? Number(e.target.value) : "",
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="form-price-usd"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price (USD) *
                  </label>
                  <input
                    id="form-price-usd"
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.priceUSD}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceUSD: e.target.value ? Number(e.target.value) : "",
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="form-transmission"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Transmission
                  </label>
                  <select
                    id="form-transmission"
                    aria-label="Select transmission type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="form-fuel"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Fuel Type
                  </label>
                  <select
                    id="form-fuel"
                    aria-label="Select fuel type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.fuel}
                    onChange={(e) =>
                      setFormData({ ...formData, fuel: e.target.value })
                    }
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="form-location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <select
                    id="form-location"
                    aria-label="Select location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Kano">Kano</option>
                    <option value="Ibadan">Ibadan</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="form-condition"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Condition
                  </label>
                  <input
                    id="form-condition"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="form-description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="form-description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        aria-label={`Remove ${feature} feature`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add feature..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URLs
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-800 px-2"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add another image
                </button>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  Featured Car
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.newly_arrived}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newly_arrived: e.target.checked,
                      })
                    }
                  />
                  Newly Arrived
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingCar ? "Update Car" : "Add Car"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
