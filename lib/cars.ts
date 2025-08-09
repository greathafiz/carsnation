import { Car, SearchFilters } from "@/types/car";
import carsData from "@/data/cars.json";

export function getAllCars(): Car[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cars");
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return carsData as Car[];
}

export function getCarById(id: string): Car | undefined {
  const cars = getAllCars();
  return cars.find((car) => car.id === id);
}

export function getFeaturedCars(): Car[] {
  const cars = getAllCars();
  return cars.filter((car) => car.featured);
}

export function getNewlyArrivedCars(): Car[] {
  const cars = getAllCars();
  return cars.filter((car) => car.newly_arrived);
}

export function searchCars(filters: SearchFilters): Car[] {
  const cars = getAllCars();

  return cars.filter((car) => {
    if (
      filters.brand &&
      car.brand.toLowerCase() !== filters.brand.toLowerCase()
    ) {
      return false;
    }
    if (filters.minPrice && car.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && car.price > filters.maxPrice) {
      return false;
    }
    if (filters.minYear && car.year < filters.minYear) {
      return false;
    }
    if (filters.maxYear && car.year > filters.maxYear) {
      return false;
    }
    if (
      filters.transmission &&
      car.transmission.toLowerCase() !== filters.transmission.toLowerCase()
    ) {
      return false;
    }
    if (filters.fuel && car.fuel.toLowerCase() !== filters.fuel.toLowerCase()) {
      return false;
    }
    if (
      filters.location &&
      car.location.toLowerCase() !== filters.location.toLowerCase()
    ) {
      return false;
    }
    return true;
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatPriceUSD(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

export function saveCars(cars: Car[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("cars", JSON.stringify(cars));
  }
}

export function addCar(car: Car): void {
  const cars = getAllCars();
  cars.push(car);
  saveCars(cars);
}

export function updateCar(updatedCar: Car): void {
  const cars = getAllCars();
  const index = cars.findIndex((car) => car.id === updatedCar.id);
  if (index !== -1) {
    cars[index] = updatedCar;
    saveCars(cars);
  }
}

export function deleteCar(id: string): void {
  const cars = getAllCars();
  const filteredCars = cars.filter((car) => car.id !== id);
  saveCars(filteredCars);
}

export function generateWhatsAppMessage(car: Car): string {
  return `Hi! I'm interested in the ${car.year} ${car.brand} ${
    car.model
  } listed for ${formatPrice(car.price)}. Can you provide more details?`;
}
