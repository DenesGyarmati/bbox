"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type PopupType = "modal" | "toast";
type StatusType = "success" | "error" | "info";

type PopupOptions = {
  title: string;
  body: string;
  status?: StatusType;
  type?: PopupType;
};

type ErrorOptions = {
  title?: string;
  body?: string;
};

type PopupContextType = {
  showPopup: (options: PopupOptions) => void;
  hidePopup: () => void;
  showError: (options?: ErrorOptions) => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<PopupOptions | null>(null);

  const showPopup = (options: PopupOptions) => {
    setPopup(options);
    if (options.type === "toast") {
      setTimeout(() => setPopup(null), 3000);
    }
  };

  const showError = (options?: ErrorOptions) => {
    setPopup({
      title: options?.title ?? "Unexpected error",
      body: options?.body ?? "Please try again later",
      type: "toast",
      status: "error",
    });
    setTimeout(() => setPopup(null), 3000);
  };

  const hidePopup = () => setPopup(null);

  const getStatusClasses = (status: StatusType | undefined) => {
    switch (status) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "info":
      default:
        return "bg-blue-600 text-white";
    }
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, showError }}>
      {children}

      {popup && popup.type === "modal" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className={`p-6 rounded-2xl shadow-xl min-w-[300px] ${getStatusClasses(
              popup.status
            )}`}
          >
            <h2 className="text-lg font-bold">{popup.title}</h2>
            <div
              className="mt-2 space-y-1"
              dangerouslySetInnerHTML={{ __html: popup.body }}
            />
            <button
              onClick={hidePopup}
              className="mt-4 px-4 py-2 bg-white text-black rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {popup && popup.type === "toast" && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg ${getStatusClasses(
              popup.status
            )}`}
          >
            <h3 className="font-bold">{popup.title}</h3>
            <p className="text-sm">{popup.body}</p>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}

export function useError() {}
