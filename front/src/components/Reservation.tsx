import { Reserve } from "@/lib/commonTypes";

interface ReservationProps {
  res: Reserve;
}

export default function Reservation({ res }: ReservationProps) {
  const totalPrice = res.quantity * (res.event?.price ?? 0);

  return (
    <div className="flex justify-between items-center">
      <span className="font-semibold text-gray-900">
        {res.event?.title || res.user_name}
      </span>
      <span className="text-gray-700 text-sm">
        <strong>Qty:</strong> {res.quantity} &nbsp;|&nbsp;
        <strong>Price:</strong> ${res.event?.price} &nbsp;|&nbsp;
        <strong>Total:</strong> ${totalPrice}
      </span>
    </div>
  );
}
