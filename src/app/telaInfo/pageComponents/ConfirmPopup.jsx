"use client";

export default function ConfirmPopup({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[300px] text-center">
        <p className="text-lg font-medium mb-5 text-gray-800">
          Confirmar alteração?
        </p>

        <div className="flex justify-center gap-6">
          {/* CANCELAR */}
          <button
            onClick={onCancel}
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
          >
            <span className="text-xl text-black">✕</span>
          </button>

          {/* CONFIRMAR */}
          <button
            onClick={onConfirm}
            className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition"
          >
            <span className="text-xl text-white">✔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
