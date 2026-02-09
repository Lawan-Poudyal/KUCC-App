export const fetchEvents = async () => {
  try {
    const res = await fetch(`http://192.168.16.104:3000/api/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }
    const data = await res.json();

    return data.events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
