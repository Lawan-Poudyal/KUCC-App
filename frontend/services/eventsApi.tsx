// frontend/services/eventApi.tsx

export const fetchEvents = async () => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }
    const data = await res.json();

    // console.log(data.events);
    // console.log(
    //   "Statuses:",
    //   data.events.map((e) => e.status),
    // );

    return data.events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchEventById = async (id) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/events/${id}`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch event with id ${id}: ${res.status}`);
    }

    const data = await res.json();
    return data.event;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }
};

export const registerForEvent = async (eventId, payment_method, token) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/events/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          payment_method,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    // console.error("Register error:", error);
    throw error;
  }
};
