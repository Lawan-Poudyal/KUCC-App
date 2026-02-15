export const becomeMemberApi = async (token) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/membership/become`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    // console.error("Get profile error:", err);
    throw err;
  }
};

export const checkMembershipStatusApi = async (token) => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/membership/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    // console.error("Get profile error:", err);
    throw err;
  }
};
