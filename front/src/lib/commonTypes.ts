interface User {
  id: number;
  name: string;
}

interface Reservation {
  id: number;
  user: User;
  quantity: number;
}
export interface Event {
  id: number;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  capacity: number | null;
  price: number | null;
  category: string | null;
  status: "draft" | "published" | "cancelled";
  owner_id: number;
  reservations?: Reservation[];
}
