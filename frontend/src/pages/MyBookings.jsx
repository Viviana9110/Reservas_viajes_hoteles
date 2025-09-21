import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyBookings = () => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null); // id de la reserva en proceso de cancelación

  // ✅ Obtener reservas del usuario
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/bookings/user/${user._id}`);

        if (!res.ok) throw new Error("Error al cargar reservas");

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("❌ Error cargando reservas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchBookings();
    }
  }, [user]);

  // ✅ Cancelar reserva
  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "¿Seguro que quieres cancelar esta reserva?"
    );
    if (!confirmCancel) return;

    try {
      setCanceling(bookingId);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Error al cancelar la reserva");
      }

      // Eliminar del estado local
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("✅ Reserva cancelada correctamente");
    } catch (err) {
      console.error("❌ Error cancelando reserva:", err);
      alert("❌ No se pudo cancelar la reserva");
    } finally {
      setCanceling(null);
    }
  };

  if (loading) return <p className="text-center">Cargando tus reservas...</p>;

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Mis Reservas</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>
        {!user ? (
          <p className="text-red-500">
            Debes iniciar sesión para ver tus reservas.
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No tienes reservas registradas.</p>
        ) : (
          bookings.map((booking) => {
            const nights =
              (new Date(booking.checkOut) - new Date(booking.checkIn)) /
              (1000 * 60 * 60 * 24);
            const total = booking.room?.pricePerNight
              ? booking.room.pricePerNight * nights
              : booking.totalPrice || 0;

            return (
              <div
                key={booking._id}
                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                    <h3 className="text-lg font-semibold">
                      {booking.hotel?.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <p className="text-gray-600">
                        {booking.hotel?.location?.city},{" "}
                        {booking.hotel?.location?.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <p className="mt-2 text-gray-700">
                        Habitación: {booking.room?.roomNumber} (
                        {booking.room?.type})
                      </p>
                    </div>
                    <p className="text-base">Total: ${total}</p>
                  </div>
                </div>

                <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                  <div>
                    <span className="font-bold">Check-In:</span>{" "}
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-bold">Check-Out:</span>{" "}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col items-start justify-center pt-3">
                  <div className="flex items-center gap-2">
                    {/* ✅ Botón cancelar */}
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      disabled={canceling === booking._id}
                      className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                    >
                      {canceling === booking._id
                        ? "Cancelando..."
                        : "Cancelar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyBookings;
