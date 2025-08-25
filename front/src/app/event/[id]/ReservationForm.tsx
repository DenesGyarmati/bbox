"use client";

import { useState } from "react";
import { usePopup } from "@/context/PopupContext";
import { useRouter } from "next/navigation";

interface Props {
  eventId: number;
}

export default function ReservationForm({ eventId }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { showPopup, showError } = usePopup();

  const handleReserve = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reservation/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, quantity }),
      });

      const result = await res.json();

      if (!res.ok) {
        showError({
          title: "Reservation failed",
          body: result.error || "Something went wrong",
        });
        router.refresh();
        return;
      }
      const popupBody = `
        <div>
          <p><strong>Reservation ID:</strong> ${result.reservation.id}</p>
          <p><strong>Quantity:</strong> ${result.reservation.quantity}</p>
          <p><strong>Price per ticket:</strong> $${result.event_price}</p>
          <p><strong>Total:</strong> $${
            result.reservation.quantity * result.event_price
          }</p>
        </div>
      `;
      showPopup({
        title: result.message || "Reservation successful",
        body: popupBody,
        status: "info",
        type: "modal",
      });
      router.refresh();
    } catch (err) {
      showError();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow mt-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reserve Tickets</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={5}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded p-2 w-20"
          />
          <button
            onClick={handleReserve}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Reserving..." : "Reserve"}
          </button>
        </div>
      </div>
    </div>
  );
}
