// frontend/services/profileApi.tsx

export const getProfileApi = async (token) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    // console.error("Get profile error:", err);
    throw err;
  }
};

export const updateProfileApi = async (token, profileData, image) => {
  try {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });

    // console.log(profileData);
    // console.log(formData);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: image.fileName || "profile.jpg",
        type: image.mimeType || "image/jpeg",
      });
    }

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/profile/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    console.error("Update profile error:", err);
    throw err;
  }
};
