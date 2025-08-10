import { CarSubmission, Car } from "@/types/car";
import { addCar } from "@/lib/cars";

export function getAllSubmissions(): CarSubmission[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("car_submissions");
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return [];
}

export function saveSubmissions(submissions: CarSubmission[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("car_submissions", JSON.stringify(submissions));
  }
}

export function addSubmission(submission: CarSubmission): void {
  const submissions = getAllSubmissions();
  submissions.push(submission);
  saveSubmissions(submissions);
}

export function getSubmissionById(id: string): CarSubmission | undefined {
  const submissions = getAllSubmissions();
  return submissions.find((submission) => submission.id === id);
}

export function updateSubmissionStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
): void {
  const submissions = getAllSubmissions();
  const submissionIndex = submissions.findIndex((sub) => sub.id === id);
  if (submissionIndex !== -1) {
    submissions[submissionIndex].status = status;
    saveSubmissions(submissions);
  }
}

export function deleteSubmission(id: string): void {
  const submissions = getAllSubmissions();
  const filteredSubmissions = submissions.filter((sub) => sub.id !== id);
  saveSubmissions(filteredSubmissions);
}

// Mock email function - in real app, this would send actual email
export function sendSubmissionEmail(
  submission: CarSubmission
): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      console.log("Car submission sent to dealer:", {
        submissionId: submission.id,
        carDetails: `${submission.year} ${submission.brand} ${submission.model}`,
        owner: submission.ownerName,
        contact: submission.ownerPhone,
        askingPrice: submission.asking_price,
      });
      resolve(true);
    }, 1000);
  });
}

export function formatSubmissionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-zinc-100 text-zinc-800 border-zinc-200";
  }
}

export function addSubmissionToCars(submission: CarSubmission): void {
  // Convert CarSubmission to Car format for adding to inventory
  const car: Car = {
    id: Date.now().toString(),
    brand: submission.brand,
    model: submission.model,
    year: submission.year,
    price: submission.asking_price,
    priceUSD: Math.round(submission.asking_price / 1650), // Rough conversion rate
    mileage: submission.mileage,
    transmission: submission.transmission,
    fuel: submission.fuel,
    condition: submission.condition,
    location: submission.location,
    description: submission.description,
    features: submission.features,
    images: submission.images.filter((img) => img.trim()),
    featured: false,
    newly_arrived: true,
    date_added: new Date().toISOString().split("T")[0],
  };

  addCar(car);
}
