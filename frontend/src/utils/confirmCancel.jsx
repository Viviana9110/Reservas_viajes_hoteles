import toast from "react-hot-toast";

export const confirmCancel = (message) => {
  return new Promise((resolve) => {
    toast.custom(
      (t) => (
        <div
          className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-w-sm w-full mx-4 ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-coffee font-semibold text-sm">Cancelar reserva</p>
              <p className="text-coffee-light text-sm mt-0.5">{message}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="px-4 py-2 text-sm font-medium text-coffee-light hover:text-coffee bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
            >
              Volver
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition cursor-pointer"
            >
              Sí, cancelar
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  });
};
