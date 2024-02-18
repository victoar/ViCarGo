export interface CarModel {
  id: string;
  imagePath: string;
  brand: string;
  model: string;
  reviewRating: number;
  reviewNumber: number
  price: number;
  year: number;
  transmission: string;
  passengers: number;
  fuelInto: string;
  horsepower: number;
  speed: number;
  consumption: number;
  additionalInfo: string;
  licensePlate: string;
  ownerId: string;
  carImages: string[];
  locationLongitude: number;
  locationLatitude: number;
  locationAddress: string;
  locationGeohash: string;
}
