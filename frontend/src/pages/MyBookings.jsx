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
          `${import.meta.env.VITE_API_URL}/bookings/user/${user._id}`,
          { credentials: "include" }
        );
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
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div>
        <div className='flex flex-col items-start text-left'>
            <h1 className='font-playfair text-4xl md:text-[40px]'>Mis Reservas</h1>
            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
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
              className="border rounded-lg shadow-md p-4 mb-4"
            >
              <h3 className="text-lg font-semibold">{booking.hotel?.name}</h3>
              <p className="text-gray-600">
                {booking.hotel?.location?.city},{" "}
                {booking.hotel?.location?.country}
              </p>
              <p>
                Habitación: {booking.room?.roomNumber} ({booking.room?.type})
              </p>
              <p>
                <span className="font-bold">Check-In:</span>{" "}
                {new Date(booking.checkIn).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold">Check-Out:</span>{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
              <p className="font-semibold text-blue-600 mt-2">
                Total: ${total}
              </p>

              {/* ✅ Botón cancelar */}
              <button
                onClick={() => cancelBooking(booking._id)}
                disabled={canceling === booking._id}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {canceling === booking._id ? "Cancelando..." : "Cancelar"}
              </button>
            </div>
          );
        })
      )}
      </div>

     
    </div>
  );
};

export default MyBookings;
