"use client";

import { useState } from "react";

interface Props {
  ticketId: number;
  maxQuantity: number;
}

export default function TicketReserveForm({ ticketId, maxQuantity }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ticket/${ticketId}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Reservation failed:", err);
        return;
      }

      alert("Reservation successful!");
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <input
        type="number"
        min={1}
        max={maxQuantity}
        value={quantity}
        onChange={(e) =>
          setQuantity(
            Math.min(Math.max(1, parseInt(e.target.value)), maxQuantity)
          )
        }
        className="w-20 p-1 border rounded"
      />
      <button
        onClick={handleReserve}
        disabled={loading}
        className="px-2 py-1 bg-blue-500 text-white rounded"
      >
        {loading ? "Reserving..." : "Reserve"}
      </button>
    </div>
  );
}
