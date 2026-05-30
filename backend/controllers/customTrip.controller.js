import CustomTrip from "../models/CustomTrip.js";

export const createCustomTrip = async (req, res) => {
  try {
    const {
      destination, preferredDate, flexibleDates, budget, groupSize,
      interests, accommodation, transportation, includesMeals, includesGuide,
      notes, destinations, itinerary,
    } = req.body;

    if (!destination && (!destinations || destinations.length === 0)) {
      return res.status(400).json({ message: "Debes seleccionar al menos un destino" });
    }

    const trip = await CustomTrip.create({
      user: req.user.id,
      destination: destination || destinations?.[0]?.destinationName || "",
      preferredDate: preferredDate || null,
      flexibleDates: flexibleDates ?? true,
      budget: budget || null,
      groupSize: groupSize || 1,
      interests: interests || [],
      accommodation: accommodation || "any",
      transportation: transportation || "any",
      includesMeals: includesMeals ?? false,
      includesGuide: includesGuide ?? false,
      notes: notes || "",
      destinations: destinations || [],
      itinerary: itinerary || [],
    });

    await trip.populate("user", "name email phone");

    res.status(201).json({ message: "Solicitud enviada con éxito", trip });
  } catch (error) {
    console.error("Error creando viaje personalizado:", error);
    res.status(500).json({ message: "Error al crear la solicitud", error: error.message });
  }
};

export const generateItinerary = async (req, res) => {
  try {
    const { selectedDestinations, startDate, groupSize } = req.body;

    if (!selectedDestinations || selectedDestinations.length === 0) {
      return res.status(400).json({ message: "Debes seleccionar al menos un destino" });
    }

    const itinerary = [];
    let currentDay = 1;
    let currentDate = startDate ? new Date(startDate) : new Date();

    for (const dest of selectedDestinations) {
      const tours = dest.selectedTours || [];
      const destDays = dest.days || 1;

      for (let d = 0; d < destDays; d++) {
        const activities = [];

        activities.push({
          time: "08:00",
          description: `Desayuno en el alojamiento y preparación para el día`,
          location: dest.destinationName,
        });

        const tourIndex = d;
        if (tours[tourIndex]) {
          const tour = tours[tourIndex];
          activities.push({
            time: "10:00",
            description: tour.tourDescription || tour.tourName,
            location: dest.destinationName,
            tourName: tour.tourName,
          });

          activities.push({
            time: "13:00",
            description: "Almuerzo durante la excursión",
            location: dest.destinationName,
          });

          const nextTour = tours[tourIndex + 1];
          if (nextTour && d + 1 < destDays) {
            activities.push({
              time: "15:00",
              description: `Preparación para las actividades del día siguiente`,
              location: dest.destinationName,
            });
          } else if (nextTour) {
            activities.push({
              time: "15:00",
              description: nextTour.tourDescription || nextTour.tourName,
              location: dest.destinationName,
              tourName: nextTour.tourName,
            });
          } else {
            activities.push({
              time: "15:00",
              description: "Tiempo libre para explorar por cuenta propia",
              location: dest.destinationName,
            });
          }
        } else {
          activities.push({
            time: "10:00",
            description: "Exploración libre del destino y sus alrededores",
            location: dest.destinationName,
          });

          activities.push({
            time: "13:00",
            description: "Almuerzo en restaurante recomendado",
            location: dest.destinationName,
          });

          activities.push({
            time: "15:00",
            description: d === destDays - 1
              ? "Tiempo libre para compras o visitas adicionales"
              : "Continúa explorando o descansa en el alojamiento",
            location: dest.destinationName,
          });
        }

        activities.push({
          time: "19:00",
          description: "Cena y tiempo libre",
          location: dest.destinationName,
        });

        if (d < destDays - 1) {
          activities.push({
            time: "21:00",
            description: "Regreso al alojamiento y descanso",
            location: dest.destinationName,
          });
        }

        itinerary.push({
          day: currentDay,
          date: new Date(currentDate),
          activities,
        });

        currentDay++;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    res.json({ itinerary });
  } catch (error) {
    console.error("Error generando itinerario:", error);
    res.status(500).json({ message: "Error al generar itinerario", error: error.message });
  }
};

export const getMyCustomTrips = async (req, res) => {
  try {
    const trips = await CustomTrip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes", error: error.message });
  }
};

export const getAllCustomTrips = async (req, res) => {
  try {
    const trips = await CustomTrip.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes", error: error.message });
  }
};

export const updateCustomTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, estimatedPrice } = req.body;

    const trip = await CustomTrip.findByIdAndUpdate(
      id,
      { status, adminNotes, estimatedPrice },
      { new: true }
    ).populate("user", "name email phone");

    if (!trip) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res.json({ message: "Solicitud actualizada", trip });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};

export const deleteCustomTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await CustomTrip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (trip.user.toString() !== req.user.id && req.user.role !== "owner") {
      return res.status(403).json({ message: "No autorizado" });
    }

    await trip.deleteOne();
    res.json({ message: "Solicitud eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};
