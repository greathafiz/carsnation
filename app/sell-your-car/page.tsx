"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CarSubmission } from "@/types/car";
import { addSubmission, sendSubmissionEmail } from "@/lib/submissions";

interface FormData {
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  brand: string;
  model: string;
  year: number | "";
  mileage: number | "";
  asking_price: number | "";
  transmission: string;
  fuel: string;
  condition: string;
  location: string;
  description: string;
  features: string[];
  images: string[];
  idDocument?: File;
}

const initialFormData: FormData = {
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  asking_price: "",
  transmission: "Automatic",
  fuel: "Petrol",
  condition: "Used",
  location: "Lagos",
  description: "",
  features: [],
  images: [""],
  idDocument: undefined,
};

export default function SellYourCarPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.ownerName ||
      !formData.ownerPhone ||
      !formData.brand ||
      !formData.model
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    const submission: CarSubmission = {
      id: Date.now().toString(),
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      ownerEmail: formData.ownerEmail,
      brand: formData.brand,
      model: formData.model,
      year: Number(formData.year),
      mileage: Number(formData.mileage),
      asking_price: Number(formData.asking_price),
      transmission: formData.transmission,
      fuel: formData.fuel,
      condition: formData.condition,
      location: formData.location,
      description: formData.description,
      features: formData.features.filter((f) => f.trim()),
      images: formData.images.filter((img) => img.trim()),
      idDocument: formData.idDocument,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    };

    try {
      addSubmission(submission);
      await sendSubmissionEmail(submission);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error submitting car:", error);
      alert("Failed to submit your car. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        idDocument: file,
      });
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md border border-zinc-200">
          <div className="text-emerald-600 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">
            Car Submission Successful!
          </h1>
          <p className="text-zinc-600 mb-6">
            Thank you for submitting your car details. We&apos;ve received your
            information and will review it within 24-48 hours. You&apos;ll be
            contacted via phone or email with our decision.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setFormData(initialFormData);
              }}
              className="w-full bg-zinc-600 hover:bg-zinc-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Submit Another Car
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-zinc-50">
      <div className="bg-white rounded-lg shadow-md p-6 border border-zinc-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">
            Sell Your Car
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Looking to sell your car? Fill out the form below with your
            car&apos;s details, and we&apos;ll review it for potential listing
            on our platform. All submissions require valid identification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Owner Information */}
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="owner-name"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="owner-name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="owner-phone"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  id="owner-phone"
                  type="tel"
                  required
                  placeholder="+234 xxx xxx xxxx"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="owner-email"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="owner-email"
                  type="email"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Car Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="car-brand"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Brand *
                </label>
                <input
                  id="car-brand"
                  type="text"
                  required
                  placeholder="e.g., Toyota, Honda, BMW"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="car-model"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Model *
                </label>
                <input
                  id="car-model"
                  type="text"
                  required
                  placeholder="e.g., Camry, Accord, 3 Series"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="car-year"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Year *
                </label>
                <input
                  id="car-year"
                  type="number"
                  required
                  min="1990"
                  max="2025"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
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
                  htmlFor="car-mileage"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Mileage (km) *
                </label>
                <input
                  id="car-mileage"
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
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
                  htmlFor="asking-price"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Asking Price (₦) *
                </label>
                <input
                  id="asking-price"
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                  value={formData.asking_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      asking_price: e.target.value
                        ? Number(e.target.value)
                        : "",
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="car-location"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Location
                </label>
                <select
                  id="car-location"
                  aria-label="Select car location"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
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
                  htmlFor="car-transmission"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Transmission
                </label>
                <select
                  id="car-transmission"
                  aria-label="Select transmission type"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
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
                  htmlFor="car-fuel"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Fuel Type
                </label>
                <select
                  id="car-fuel"
                  aria-label="Select fuel type"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
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
            </div>

            <div className="mt-6">
              <label
                htmlFor="car-description"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="car-description"
                rows={4}
                placeholder="Tell us more about your car's condition, history, and any notable features..."
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Features */}
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Features
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center border border-orange-200"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
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
                placeholder="Add feature (e.g., Air Conditioning, Leather Seats)..."
                className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Car Photos
            </h2>
            <p className="text-sm text-zinc-600 mb-4">
              Add image URLs of your car (exterior, interior, engine bay, etc.)
            </p>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  placeholder="https://example.com/car-image.jpg"
                  className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
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
              className="text-orange-600 hover:text-orange-800 text-sm"
            >
              + Add another image
            </button>
          </div>

          {/* ID Document */}
          <div className="bg-zinc-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Identity Verification
            </h2>
            <div>
              <label
                htmlFor="id-document"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Valid ID Document (National ID, Driver&apos;s License, or
                Passport)
              </label>
              <input
                id="id-document"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-zinc-900"
                onChange={handleFileChange}
              />
              <p className="text-xs text-zinc-500 mt-1">
                Accepted formats: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-400 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Car for Review"}
            </button>
            <p className="text-sm text-zinc-500 mt-2">
              By submitting, you agree to our terms and conditions. We&apos;ll
              review your submission and contact you within 24-48 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
