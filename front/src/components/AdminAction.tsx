"use client";

import { usePopup } from "@/context/PopupContext";

export default function AdminAction({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) {
  const { showError } = usePopup();
  const toggleStatus = async () => {
    try {
      await fetch(`/api/admin/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      window.location.reload();
    } catch (err) {
      showError({
        title: "Failed to update user status",
        body: err?.toString(),
      });
    }
  };

  return (
    <button
      className={`px-3 py-1 rounded text-white ${
        isActive ? "bg-red-500" : "bg-green-500"
      }`}
      onClick={toggleStatus}
    >
      {isActive ? "Block" : "Unblock"}
    </button>
  );
}
