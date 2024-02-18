export interface ReservationModel {
  id: string;
  renterId: string;
  ownerId: string;
  carId: string;
  startDate: any;
  endDate: any;
  additionalInfo: string;
  status: string; // 'pending', 'accepted', 'declined', 'completed'
  price: number;
  brand: string;
  model: string;
  isReviewed: boolean;
}
