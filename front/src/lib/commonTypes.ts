interface User {
  id: number;
  name: string;
}

interface Reservation {
  id: number;
  user_id: number;
  user: User;
  quantity: number;
  created_at: string;
  updated_at: string;
}
export interface Event {
  id: number;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  capacity: number | null;
  remaining_capacity: number;
  price: number | null;
  category: string | null;
  status: "draft" | "published" | "cancelled";
  owner_id: number;
  reservations?: Reservation[];
}

export interface Reserve {
  id: number;
  event_title: string;
  event_id: number;
  quantity: number;
  user_name?: string;
  event?: {
    id: number;
    title: string;
    price: number;
  };
}
